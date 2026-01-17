import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware, requireCoach } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

router.use(clerkMiddleware);
router.use(requireCoach);

// Get pending approvals for coach
router.get(
  "/pending",
  asyncHandler(async (req: any, res: any) => {
    const coachId = req.user!.id;

    const pendingApprovals = await prisma.aIResponse.findMany({
      where: {
        status: "PENDING",
        message: {
          conversation: {
            clientProfile: {
              coachId,
            },
          },
        },
      },
      include: {
        message: {
          include: {
            conversation: {
              include: {
                clientProfile: {
                  include: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        imageUrl: true,
                      },
                    },
                  },
                },
                messages: {
                  where: { type: "USER_MESSAGE" },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Format for easier consumption
    const formatted = pendingApprovals.map((approval) => ({
      id: approval.id,
      originalContent: approval.originalContent,
      confidence: approval.confidence,
      sourceDocs: approval.sourceDocs,
      createdAt: approval.createdAt,
      client: {
        id: approval.message.conversation.clientProfile.id,
        ...approval.message.conversation.clientProfile.user,
      },
      clientMessage:
        approval.message.conversation.messages[0]?.content || "No message",
      conversationId: approval.message.conversationId,
    }));

    res.json({ approvals: formatted });
  })
);

// Get approval history
router.get(
  "/history",
  asyncHandler(async (req: any, res: any) => {
    const coachId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const approvals = await prisma.aIResponse.findMany({
      where: {
        status: { not: "PENDING" },
        message: {
          conversation: {
            clientProfile: {
              coachId,
            },
          },
        },
      },
      include: {
        message: {
          include: {
            conversation: {
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
              },
            },
          },
        },
      },
      orderBy: { reviewedAt: "desc" },
      take: limit,
      skip: offset,
    });

    res.json({ approvals });
  })
);

// Approve, reject, or edit a response
const approvalActionSchema = z.object({
  action: z.enum(["approve", "reject", "edit"]),
  editedContent: z.string().optional(),
  rejectionReason: z.string().optional(),
});

router.post(
  "/:id/action",
  asyncHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const coachId = req.user!.id;
    const data = approvalActionSchema.parse(req.body);

    // Verify the approval belongs to this coach's client
    const approval = await prisma.aIResponse.findFirst({
      where: {
        id,
        message: {
          conversation: {
            clientProfile: {
              coachId,
            },
          },
        },
      },
      include: {
        message: {
          include: {
            conversation: {
              include: {
                clientProfile: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!approval) {
      throw new AppError("Approval not found", 404);
    }

    if (approval.status !== "PENDING") {
      throw new AppError("This response has already been processed", 400);
    }

    let updateData: any = {
      reviewedAt: new Date(),
      reviewedBy: coachId,
    };

    switch (data.action) {
      case "approve":
        updateData.status = "APPROVED";
        updateData.finalContent = approval.originalContent;
        break;

      case "edit":
        if (!data.editedContent) {
          throw new AppError("Edited content is required", 400);
        }
        updateData.status = "EDITED";
        updateData.editedContent = data.editedContent;
        updateData.finalContent = data.editedContent;
        break;

      case "reject":
        updateData.status = "REJECTED";
        updateData.rejectionReason = data.rejectionReason || "No reason provided";
        break;
    }

    const updated = await prisma.aIResponse.update({
      where: { id },
      data: updateData,
    });

    // If approved or edited, notify the client
    if (data.action === "approve" || data.action === "edit") {
      await prisma.notification.create({
        data: {
          userId: approval.message.conversation.clientProfile.userId,
          type: "RESPONSE_APPROVED",
          title: "New message from your coach",
          body: "Your coach has responded to your message",
          referenceId: approval.message.id,
          referenceType: "message",
        },
      });

      // Mark the message as ready to display
      await prisma.message.update({
        where: { id: approval.messageId },
        data: {
          content: updated.finalContent,
        },
      });
    }

    res.json({ approval: updated });
  })
);

// Bulk approve
const bulkApproveSchema = z.object({
  ids: z.array(z.string()),
});

router.post(
  "/bulk-approve",
  asyncHandler(async (req: any, res: any) => {
    const coachId = req.user!.id;
    const { ids } = bulkApproveSchema.parse(req.body);

    // Verify all approvals belong to this coach
    const approvals = await prisma.aIResponse.findMany({
      where: {
        id: { in: ids },
        status: "PENDING",
        message: {
          conversation: {
            clientProfile: {
              coachId,
            },
          },
        },
      },
    });

    if (approvals.length !== ids.length) {
      throw new AppError("Some approvals were not found or already processed", 400);
    }

    // Update all
    await prisma.aIResponse.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: coachId,
      },
    });

    res.json({ success: true, count: ids.length });
  })
);

export default router;
