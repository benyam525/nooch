import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware, requireCoach } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";
import { calculateRiskScore, updateAllClientRiskScores } from "../services/riskCalculator";

const router = Router();

// All routes require authentication
router.use(clerkMiddleware);

// ============================================
// STATIC ROUTES (must come before /:id routes)
// ============================================

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

// Get clients at risk (sorted by risk score)
router.get(
  "/at-risk",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const clients = await prisma.clientProfile.findMany({
      where: {
        coachId: req.user!.id,
        riskScore: { gte: 25 }, // At least moderate risk
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
        weeklyCheckins: {
          orderBy: { weekStartDate: "desc" },
          take: 4,
        },
      },
      orderBy: { riskScore: "desc" },
    });

    res.json({ clients });
  })
);

// Recalculate risk scores for all clients of a coach
router.post(
  "/risk/recalculate-all",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    await updateAllClientRiskScores(req.user!.id);

    res.json({
      success: true,
      message: "Risk scores updated for all clients",
    });
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

// ============================================
// PARAMETERIZED ROUTES (/:id patterns)
// ============================================

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

// Update client health profile
const healthProfileSchema = z.object({
  currentWeight: z.number().positive().optional(),
  targetWeight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  dateOfBirth: z.string().datetime().optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
});

router.patch(
  "/:id/health-profile",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const data = healthProfileSchema.parse(req.body);

    const updateData: any = { ...data };
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    const client = await prisma.clientProfile.updateMany({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
      data: updateData,
    });

    if (client.count === 0) {
      throw new AppError("Client not found", 404);
    }

    res.json({ success: true });
  })
);

// Get client risk breakdown
router.get(
  "/:id/risk",
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
            firstName: true,
            lastName: true,
          },
        },
        weeklyCheckins: {
          orderBy: { weekStartDate: "desc" },
          take: 8,
        },
        progressPhotos: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    res.json({
      client: {
        id: client.id,
        name: `${client.user.firstName || ""} ${client.user.lastName || ""}`.trim(),
        riskScore: client.riskScore,
        riskFactors: client.riskFactors,
        lastRiskUpdate: client.lastRiskUpdate,
        recentCheckins: client.weeklyCheckins,
        lastPhoto: client.progressPhotos[0] || null,
        lastMessage: client.conversations[0]?.messages[0] || null,
      },
    });
  })
);

// Recalculate risk score for a single client
router.post(
  "/:id/risk/recalculate",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    // Verify client belongs to coach
    const client = await prisma.clientProfile.findFirst({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
    });

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    const { score, factors, breakdown } = await calculateRiskScore(client.id);

    // Update the client profile with new risk data
    await prisma.clientProfile.update({
      where: { id: client.id },
      data: {
        riskScore: score,
        riskFactors: factors as any,
        lastRiskUpdate: new Date(),
      },
    });

    res.json({
      success: true,
      riskScore: score,
      riskFactors: factors,
      breakdown,
    });
  })
);

export default router;
