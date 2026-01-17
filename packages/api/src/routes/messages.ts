import { Router } from "express";
import { prisma } from "@nooch/db";
import { generateResponse, formatConversationHistory, formatClientContext } from "@nooch/ai";
import { clerkMiddleware } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

router.use(clerkMiddleware);

// Get conversations for current user
router.get(
  "/conversations",
  asyncHandler(async (req: any, res: any) => {
    const user = req.user!;

    if (user.role === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: user.id },
      });

      if (!clientProfile) {
        throw new AppError("Client profile not found", 404);
      }

      const conversations = await prisma.conversation.findMany({
        where: { clientProfileId: clientProfile.id },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return res.json({ conversations });
    }

    // For coaches, get conversations across all their clients
    const conversations = await prisma.conversation.findMany({
      where: {
        clientProfile: {
          coachId: user.id,
        },
      },
      include: {
        clientProfile: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ conversations });
  })
);

// Get messages in a conversation
router.get(
  "/conversations/:conversationId",
  asyncHandler(async (req: any, res: any) => {
    const { conversationId } = req.params;
    const user = req.user!;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        clientProfile: {
          include: {
            user: true,
            coach: true,
          },
        },
        messages: {
          include: {
            aiResponse: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    // Verify access
    const isClient = conversation.clientProfile.userId === user.id;
    const isCoach = conversation.clientProfile.coachId === user.id;

    if (!isClient && !isCoach) {
      throw new AppError("Access denied", 403);
    }

    res.json({ conversation });
  })
);

// Send a message (client only)
const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1).max(5000),
});

router.post(
  "/send",
  asyncHandler(async (req: any, res: any) => {
    const user = req.user!;
    const data = sendMessageSchema.parse(req.body);

    if (user.role !== "CLIENT") {
      throw new AppError("Only clients can send messages through this endpoint", 403);
    }

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
      include: {
        coach: {
          include: {
            methodologies: {
              where: { status: "READY" },
              take: 1,
            },
          },
        },
      },
    });

    if (!clientProfile) {
      throw new AppError("Client profile not found", 404);
    }

    // Get or create conversation
    let conversation;
    if (data.conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: data.conversationId,
          clientProfileId: clientProfile.id,
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          clientProfileId: clientProfile.id,
          title: "New Conversation",
        },
      });
    }

    // Create the user's message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        type: "USER_MESSAGE",
        content: data.content,
      },
    });

    // Get conversation history for context
    const recentMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const history = formatConversationHistory(
      recentMessages.reverse().map((m) => ({
        role: m.type === "USER_MESSAGE" ? "Client" : "Coach AI",
        content: m.content,
      }))
    );

    const clientContext = formatClientContext({
      firstName: user.firstName,
      lastName: user.lastName,
      goals: clientProfile.goals,
      preferences: clientProfile.preferences,
    });

    // Generate AI response using RAG
    const coachNamespace = clientProfile.coach.methodologies[0]?.pineconeNamespace;

    let aiResponse;
    if (coachNamespace) {
      try {
        aiResponse = await generateResponse({
          clientMessage: data.content,
          coachNamespace,
          clientContext,
          conversationHistory: history,
        });
      } catch (error) {
        console.error("AI generation error:", error);
        // Fall back to a generic response
        aiResponse = {
          response: "Thank you for your message. Your coach will respond shortly.",
          sourceDocs: [],
          confidence: 0,
        };
      }
    } else {
      aiResponse = {
        response: "Thank you for your message. Your coach will respond shortly.",
        sourceDocs: [],
        confidence: 0,
      };
    }

    // Create the AI response message (pending approval)
    const aiMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        type: "AI_RESPONSE",
        content: aiResponse.response,
        aiResponse: {
          create: {
            originalContent: aiResponse.response,
            finalContent: aiResponse.response,
            status: "PENDING",
            sourceDocs: aiResponse.sourceDocs,
            confidence: aiResponse.confidence,
          },
        },
      },
      include: {
        aiResponse: true,
      },
    });

    // Create notification for coach
    await prisma.notification.create({
      data: {
        userId: clientProfile.coachId,
        type: "APPROVAL_NEEDED",
        title: "New response needs approval",
        body: `AI generated a response for ${user.firstName || "a client"}`,
        referenceId: aiMessage.aiResponse!.id,
        referenceType: "ai_response",
      },
    });

    res.json({
      userMessage,
      aiMessage: {
        ...aiMessage,
        status: "pending_approval",
      },
      conversationId: conversation.id,
    });
  })
);

export default router;
