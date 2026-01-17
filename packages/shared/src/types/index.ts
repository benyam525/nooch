import { z } from "zod";

// User types
export const UserRoleSchema = z.enum(["COACH", "CLIENT"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  imageUrl: z.string().nullable(),
  role: UserRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

// Message types
export const MessageTypeSchema = z.enum([
  "USER_MESSAGE",
  "AI_RESPONSE",
  "COACH_MESSAGE",
  "SYSTEM",
]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

export const ApprovalStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EDITED",
]);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string().nullable(),
  type: MessageTypeSchema,
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Message = z.infer<typeof MessageSchema>;

// AI Response types
export const AIResponseSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  originalContent: z.string(),
  editedContent: z.string().nullable(),
  finalContent: z.string(),
  status: ApprovalStatusSchema,
  reviewedAt: z.date().nullable(),
  reviewedBy: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  sourceDocs: z.any().nullable(),
  confidence: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type AIResponse = z.infer<typeof AIResponseSchema>;

// Document types
export const DocumentStatusSchema = z.enum([
  "UPLOADING",
  "PROCESSING",
  "READY",
  "FAILED",
]);
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

// API Request/Response types
export const SendMessageRequestSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1).max(5000),
});
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

export const ApprovalActionSchema = z.object({
  aiResponseId: z.string(),
  action: z.enum(["approve", "reject", "edit"]),
  editedContent: z.string().optional(),
  rejectionReason: z.string().optional(),
});
export type ApprovalAction = z.infer<typeof ApprovalActionSchema>;

export const ProgressLogRequestSchema = z.object({
  logType: z.string(),
  content: z.string(),
  logDate: z.date().optional(),
});
export type ProgressLogRequest = z.infer<typeof ProgressLogRequestSchema>;

// Notification types
export const NotificationTypeSchema = z.enum([
  "NEW_MESSAGE",
  "APPROVAL_NEEDED",
  "RESPONSE_APPROVED",
  "RESPONSE_REJECTED",
  "COACH_MESSAGE",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
