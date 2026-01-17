// API endpoints
export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  CLIENTS: "/api/clients",
  MESSAGES: "/api/messages",
  APPROVALS: "/api/approvals",
  METHODOLOGY: "/api/methodology",
  NOTIFICATIONS: "/api/notifications",
} as const;

// Supported file types for methodology uploads
export const SUPPORTED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "text/plain": ".txt",
  "text/markdown": ".md",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Message limits
export const MAX_MESSAGE_LENGTH = 5000;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// AI settings
export const AI_CONFIG = {
  MODEL: "gpt-4-turbo-preview",
  EMBEDDING_MODEL: "text-embedding-3-small",
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  RETRIEVAL_K: 4,
} as const;

// Progress log types
export const PROGRESS_LOG_TYPES = [
  "weight",
  "meal",
  "workout",
  "mood",
  "sleep",
  "water",
  "habit",
  "note",
] as const;

export type ProgressLogType = (typeof PROGRESS_LOG_TYPES)[number];
