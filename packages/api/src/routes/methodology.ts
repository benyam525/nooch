import { Router } from "express";
import multer from "multer";
import { prisma } from "@nooch/db";
import { processAndEmbedDocument, deleteNamespace } from "@nooch/ai";
import { clerkMiddleware, requireCoach } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from "@nooch/shared";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (Object.keys(SUPPORTED_FILE_TYPES).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

router.use(clerkMiddleware);
router.use(requireCoach);

// Get all methodology documents for coach
router.get(
  "/",
  asyncHandler(async (req: any, res: any) => {
    const documents = await prisma.coachMethodology.findMany({
      where: { coachId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ documents });
  })
);

// Upload a new document
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req: any, res: any) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { title, description } = req.body;

    // Create the document record
    const document = await prisma.coachMethodology.create({
      data: {
        coachId: req.user!.id,
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        title: title || originalname,
        description,
        status: "PROCESSING",
      },
    });

    // Process and embed the document (async)
    const namespace = `coach_${req.user!.id}_doc_${document.id}`;

    // Process in background
    processAndEmbedDocument(buffer, originalname, mimetype, namespace)
      .then(async (result) => {
        await prisma.coachMethodology.update({
          where: { id: document.id },
          data: {
            status: result.success ? "READY" : "FAILED",
            pineconeNamespace: result.success ? namespace : null,
            chunkCount: result.chunkCount,
            processingError: result.error,
          },
        });
      })
      .catch(async (error) => {
        await prisma.coachMethodology.update({
          where: { id: document.id },
          data: {
            status: "FAILED",
            processingError: error.message,
          },
        });
      });

    res.json({
      document,
      message: "Document uploaded and processing started",
    });
  })
);

// Get document status
router.get(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const document = await prisma.coachMethodology.findFirst({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
    });

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    res.json({ document });
  })
);

// Delete a document
router.delete(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const document = await prisma.coachMethodology.findFirst({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
    });

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    // Delete from Pinecone if exists
    if (document.pineconeNamespace) {
      try {
        await deleteNamespace(document.pineconeNamespace);
      } catch (error) {
        console.error("Failed to delete Pinecone namespace:", error);
      }
    }

    // Delete from database
    await prisma.coachMethodology.delete({
      where: { id: document.id },
    });

    res.json({ success: true });
  })
);

// Update document metadata
router.patch(
  "/:id",
  asyncHandler(async (req: any, res: any) => {
    const { title, description } = req.body;

    const document = await prisma.coachMethodology.updateMany({
      where: {
        id: req.params.id,
        coachId: req.user!.id,
      },
      data: {
        title,
        description,
      },
    });

    if (document.count === 0) {
      throw new AppError("Document not found", 404);
    }

    res.json({ success: true });
  })
);

export default router;
