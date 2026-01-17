export interface RAGInput {
  clientMessage: string;
  coachNamespace: string;
  clientContext?: string;
  conversationHistory?: string;
}

export interface RAGOutput {
  response: string;
  sourceDocs: SourceDocument[];
  confidence: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface SourceDocument {
  content: string;
  metadata: Record<string, any>;
}

export interface ProcessedDocument {
  chunks: DocumentChunk[];
  totalChunks: number;
  metadata: DocumentMetadata;
}

export interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    page?: number;
    chunk: number;
  };
}

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount?: number;
}

export interface EmbeddingResult {
  namespace: string;
  chunkCount: number;
  success: boolean;
  error?: string;
}
