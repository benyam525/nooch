import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

router.use(clerkMiddleware);

// Get notifications for current user
router.get(
  "/",
  asyncHandler(async (req: any, res: any) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unread === "true";

    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user!.id,
        ...(unreadOnly && { isRead: false }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user!.id,
        isRead: false,
      },
    });

    res.json({ notifications, unreadCount });
  })
);

// Mark notification as read
router.patch(
  "/:id/read",
  asyncHandler(async (req: any, res: any) => {
    await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  })
);

// Mark all notifications as read
router.post(
  "/read-all",
  asyncHandler(async (req: any, res: any) => {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  })
);

// Register push token
const registerTokenSchema = z.object({
  token: z.string(),
  platform: z.enum(["ios", "android", "web"]),
});

router.post(
  "/push-token",
  asyncHandler(async (req: any, res: any) => {
    const { token, platform } = registerTokenSchema.parse(req.body);

    await prisma.pushToken.upsert({
      where: { token },
      update: {
        userId: req.user!.id,
        platform,
        isActive: true,
      },
      create: {
        userId: req.user!.id,
        token,
        platform,
      },
    });

    res.json({ success: true });
  })
);

// Deactivate push token
router.delete(
  "/push-token/:token",
  asyncHandler(async (req: any, res: any) => {
    await prisma.pushToken.updateMany({
      where: {
        token: req.params.token,
        userId: req.user!.id,
      },
      data: { isActive: false },
    });

    res.json({ success: true });
  })
);

export default router;
