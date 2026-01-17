import { Router } from "express";
import { prisma } from "@nooch/db";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

const syncUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  role: z.enum(["COACH", "CLIENT"]),
});

// Sync user from Clerk webhook or initial auth
router.post(
  "/sync",
  asyncHandler(async (req: any, res: any) => {
    const data = syncUserSchema.parse(req.body);

    const user = await prisma.user.upsert({
      where: { clerkId: data.clerkId },
      update: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        role: data.role,
        ...(data.role === "COACH" && {
          coachProfile: {
            create: {},
          },
        }),
      },
    });

    res.json({ user });
  })
);

// Get current user
router.get(
  "/me",
  asyncHandler(async (req: any, res: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // In production, verify the token and get user
    // For now, return a placeholder
    res.json({ message: "Use Clerk's useUser hook on the client" });
  })
);

export default router;
