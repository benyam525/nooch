import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware, requireCoach } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

// All routes require authentication
router.use(clerkMiddleware);

// Get all clients for a coach
router.get(
  "/",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const clients = await prisma.clientProfile.findMany({
      where: { coachId: req.user!.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        conversations: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            progressLogs: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ clients });
  })
);

// Get a single client
router.get(
  "/:id",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const client = await prisma.clientProfile.findFirst({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        progressLogs: {
          orderBy: { logDate: "desc" },
          take: 10,
        },
        conversations: {
          orderBy: { updatedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    res.json({ client });
  })
);

// Update client profile
const updateClientSchema = z.object({
  goals: z.string().optional(),
  preferences: z.any().optional(),
});

router.patch(
  "/:id",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const data = updateClientSchema.parse(req.body);

    const client = await prisma.clientProfile.updateMany({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
      data,
    });

    if (client.count === 0) {
      throw new AppError("Client not found", 404);
    }

    res.json({ success: true });
  })
);

// Invite a new client
const inviteClientSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.post(
  "/invite",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const data = inviteClientSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Check if already a client of this coach
      const existingClient = await prisma.clientProfile.findFirst({
        where: {
          userId: existingUser.id,
          coachId: req.user!.id,
        },
      });

      if (existingClient) {
        throw new AppError("Client already exists", 400);
      }
    }

    // In production, send an invitation email
    // For MVP, just return success
    res.json({
      success: true,
      message: "Invitation would be sent to " + data.email,
    });
  })
);

export default router;
