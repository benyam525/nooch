import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware, requireCoach, requireClient } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

// All routes require authentication
router.use(clerkMiddleware);

// Get check-ins (filtered by client for coaches, own for clients)
router.get(
  "/",
  asyncHandler(async (req: any, res: any) => {
    const { clientId, startDate, endDate } = req.query;

    let where: any = {};

    if (req.user!.role === "COACH") {
      // Coach can view any of their clients' check-ins
      if (clientId) {
        // Verify client belongs to coach
        const client = await prisma.clientProfile.findFirst({
          where: { id: clientId, coachId: req.user!.id },
        });
        if (!client) {
          throw new AppError("Client not found", 404);
        }
        where.clientProfileId = clientId;
      } else {
        // Get all clients' check-ins
        const clientIds = await prisma.clientProfile.findMany({
          where: { coachId: req.user!.id },
          select: { id: true },
        });
        where.clientProfileId = { in: clientIds.map((c) => c.id) };
      }
    } else {
      // Client can only view their own check-ins
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user!.id },
      });
      if (!clientProfile) {
        throw new AppError("Client profile not found", 404);
      }
      where.clientProfileId = clientProfile.id;
    }

    // Date filtering
    if (startDate) {
      where.weekStartDate = { ...where.weekStartDate, gte: new Date(startDate) };
    }
    if (endDate) {
      where.weekEndDate = { ...where.weekEndDate, lte: new Date(endDate) };
    }

    const checkins = await prisma.weeklyCheckin.findMany({
      where,
      include: {
        clientProfile: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { weekStartDate: "desc" },
    });

    res.json({ checkins });
  })
);

// Get clients with overdue check-ins (coach only)
router.get(
  "/due",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get all clients for this coach
    const clients = await prisma.clientProfile.findMany({
      where: { coachId: req.user!.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
        weeklyCheckins: {
          orderBy: { weekStartDate: "desc" },
          take: 1,
        },
      },
    });

    // Filter to clients who haven't checked in this week
    const dueClients = clients.filter((client) => {
      if (client.weeklyCheckins.length === 0) return true;
      const lastCheckin = client.weeklyCheckins[0];
      return lastCheckin.weekStartDate < oneWeekAgo;
    });

    res.json({
      dueClients: dueClients.map((c) => ({
        id: c.id,
        user: c.user,
        lastCheckin: c.weeklyCheckins[0] || null,
        daysSinceLastCheckin: c.weeklyCheckins[0]
          ? Math.floor(
              (Date.now() - c.weeklyCheckins[0].weekStartDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      })),
    });
  })
);

// Get a single check-in
router.get(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const checkin = await prisma.weeklyCheckin.findUnique({
      where: { id: req.params.id },
      include: {
        clientProfile: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!checkin) {
      throw new AppError("Check-in not found", 404);
    }

    // Verify access
    if (req.user!.role === "COACH") {
      if (checkin.clientProfile.coachId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    } else {
      if (checkin.clientProfile.userId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    }

    res.json({ checkin });
  })
);

// Client submits a weekly check-in
const createCheckinSchema = z.object({
  complianceScore: z.number().min(1).max(10),
  currentWeight: z.number().positive().optional(),
  notes: z.string().optional(),
  weekStartDate: z.string().datetime().optional(),
});

router.post(
  "/",
  requireClient,
  asyncHandler(async (req: any, res: any) => {
    const data = createCheckinSchema.parse(req.body);

    // Get client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        weeklyCheckins: {
          orderBy: { weekStartDate: "desc" },
          take: 1,
        },
      },
    });

    if (!clientProfile) {
      throw new AppError("Client profile not found", 404);
    }

    // Calculate week dates (Monday to Sunday)
    const now = new Date();
    const weekStart = data.weekStartDate
      ? new Date(data.weekStartDate)
      : getWeekStart(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Check if check-in already exists for this week
    const existingCheckin = await prisma.weeklyCheckin.findUnique({
      where: {
        clientProfileId_weekStartDate: {
          clientProfileId: clientProfile.id,
          weekStartDate: weekStart,
        },
      },
    });

    if (existingCheckin) {
      throw new AppError("Check-in already exists for this week", 400);
    }

    // Calculate weight change if applicable
    let weightChange: number | null = null;
    if (data.currentWeight && clientProfile.weeklyCheckins.length > 0) {
      const lastWeight = clientProfile.weeklyCheckins[0].currentWeight;
      if (lastWeight) {
        weightChange = data.currentWeight - lastWeight;
      }
    }

    // Calculate compliance trend
    let complianceTrend = "stable";
    if (clientProfile.weeklyCheckins.length >= 2) {
      const recentScores = clientProfile.weeklyCheckins
        .slice(0, 3)
        .map((c) => c.complianceScore);
      const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      if (data.complianceScore > avgRecent + 1) {
        complianceTrend = "improving";
      } else if (data.complianceScore < avgRecent - 1) {
        complianceTrend = "declining";
      }
    }

    const checkin = await prisma.weeklyCheckin.create({
      data: {
        clientProfileId: clientProfile.id,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        complianceScore: data.complianceScore,
        currentWeight: data.currentWeight,
        notes: data.notes,
        weightChange,
        complianceTrend,
      },
    });

    // Update client's current weight if provided
    if (data.currentWeight) {
      await prisma.clientProfile.update({
        where: { id: clientProfile.id },
        data: { currentWeight: data.currentWeight },
      });
    }

    res.status(201).json({ checkin });
  })
);

// Coach adds notes/rating to a check-in
const updateCheckinSchema = z.object({
  coachNotes: z.string().optional(),
  coachRating: z.number().min(1).max(10).optional(),
});

router.patch(
  "/:id",
  requireCoach,
  asyncHandler(async (req: any, res: any) => {
    const data = updateCheckinSchema.parse(req.body);

    // Verify coach owns this client
    const checkin = await prisma.weeklyCheckin.findUnique({
      where: { id: req.params.id },
      include: { clientProfile: true },
    });

    if (!checkin) {
      throw new AppError("Check-in not found", 404);
    }

    if (checkin.clientProfile.coachId !== req.user!.id) {
      throw new AppError("Not authorized", 403);
    }

    const updated = await prisma.weeklyCheckin.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ checkin: updated });
  })
);

// Helper: Get Monday of the current week
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default router;
