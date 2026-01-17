import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import clientRoutes from "./routes/clients";
import messageRoutes from "./routes/messages";
import approvalRoutes from "./routes/approvals";
import methodologyRoutes from "./routes/methodology";
import notificationRoutes from "./routes/notifications";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://app.nooch.ai", "https://nooch.ai"]
        : ["http://localhost:3000", "http://localhost:8081"],
    credentials: true,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/methodology", methodologyRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;
