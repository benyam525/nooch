import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { prisma } from "@nooch/db";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        clerkId: string;
      };
      user?: {
        id: string;
        clerkId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const clerkMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify the JWT token with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!payload || !payload.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const clerkId = payload.sub;

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.auth = {
      userId: user.id,
      clerkId: user.clerkId,
    };
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const requireCoach = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "COACH") {
    return res.status(403).json({ error: "Coach access required" });
  }
  next();
};

export const requireClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "CLIENT") {
    return res.status(403).json({ error: "Client access required" });
  }
  next();
};
