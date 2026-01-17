import { Router } from "express";
import { prisma } from "@nooch/db";
import { clerkMiddleware, requireCoach } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { z } from "zod";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and HEIC are allowed."));
    }
  },
});

// All routes require authentication
router.use(clerkMiddleware);

// Helper: Upload buffer to Cloudinary
async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ url: string; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `nooch/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" }, // Max dimensions
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
        eager: [
          { width: 300, height: 300, crop: "fill", gravity: "auto" }, // Thumbnail
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

// Get photos (filtered by client for coaches, own for clients)
router.get(
  "/",
  asyncHandler(async (req: any, res: any) => {
    const { clientId, photoType, limit = "20", offset = "0" } = req.query;

    let where: any = {};

    if (req.user!.role === "COACH") {
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
        // Get all clients' photos
        const clientIds = await prisma.clientProfile.findMany({
          where: { coachId: req.user!.id },
          select: { id: true },
        });
        where.clientProfileId = { in: clientIds.map((c) => c.id) };
      }
    } else {
      // Client can only view their own photos
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user!.id },
      });
      if (!clientProfile) {
        throw new AppError("Client profile not found", 404);
      }
      where.clientProfileId = clientProfile.id;
    }

    if (photoType) {
      where.photoType = photoType;
    }

    const photos = await prisma.progressPhoto.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.progressPhoto.count({ where });

    res.json({ photos, total });
  })
);

// Get a single photo
router.get(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const photo = await prisma.progressPhoto.findUnique({
      where: { id: req.params.id },
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
    });

    if (!photo) {
      throw new AppError("Photo not found", 404);
    }

    // Verify access
    if (req.user!.role === "COACH") {
      if (photo.clientProfile.coachId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    } else {
      if (photo.clientProfile.userId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    }

    res.json({ photo });
  })
);

// Upload a photo (clients only)
router.post(
  "/",
  upload.single("photo"),
  asyncHandler(async (req: any, res: any) => {
    if (!req.file) {
      throw new AppError("No photo provided", 400);
    }

    // Get client profile (works for both coaches uploading for clients and clients uploading for themselves)
    let clientProfileId: string;

    if (req.user!.role === "CLIENT") {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user!.id },
      });
      if (!clientProfile) {
        throw new AppError("Client profile not found", 404);
      }
      clientProfileId = clientProfile.id;
    } else if (req.user!.role === "COACH" && req.body.clientId) {
      // Coach uploading on behalf of client
      const client = await prisma.clientProfile.findFirst({
        where: { id: req.body.clientId, coachId: req.user!.id },
      });
      if (!client) {
        throw new AppError("Client not found", 404);
      }
      clientProfileId = client.id;
    } else {
      throw new AppError("Client ID required for coach uploads", 400);
    }

    const photoType = req.body.photoType || "progress";
    if (!["progress", "meal", "workout"].includes(photoType)) {
      throw new AppError("Invalid photo type", 400);
    }

    // Upload to Cloudinary
    const { url, thumbnailUrl } = await uploadToCloudinary(
      req.file.buffer,
      `clients/${clientProfileId}/${photoType}`
    );

    // Create database record
    const photo = await prisma.progressPhoto.create({
      data: {
        clientProfileId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        fileUrl: url,
        thumbnailUrl,
        photoType,
        caption: req.body.caption,
        takenAt: req.body.takenAt ? new Date(req.body.takenAt) : null,
      },
    });

    res.status(201).json({ photo });
  })
);

// Delete a photo
router.delete(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const photo = await prisma.progressPhoto.findUnique({
      where: { id: req.params.id },
      include: { clientProfile: true },
    });

    if (!photo) {
      throw new AppError("Photo not found", 404);
    }

    // Verify access
    if (req.user!.role === "COACH") {
      if (photo.clientProfile.coachId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    } else {
      if (photo.clientProfile.userId !== req.user!.id) {
        throw new AppError("Not authorized", 403);
      }
    }

    // Delete from Cloudinary (extract public_id from URL)
    try {
      const urlParts = photo.fileUrl.split("/");
      const publicIdWithExtension = urlParts.slice(-3).join("/");
      const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete from Cloudinary:", error);
      // Continue with database deletion even if Cloudinary fails
    }

    await prisma.progressPhoto.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  })
);

export default router;
