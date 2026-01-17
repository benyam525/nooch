import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdfParse from "pdf-parse";
import { createVectorStore } from "../vectorstore/pinecone";
import type {
  ProcessedDocument,
  DocumentChunk,
  EmbeddingResult,
} from "../types";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

/**
 * Process a PDF file and extract text content
 */
export async function processPDF(
  buffer: Buffer,
  fileName: string
): Promise<ProcessedDocument> {
  const data = await pdfParse(buffer);

  const chunks = await textSplitter.createDocuments(
    [data.text],
    [{ source: fileName }]
  );

  return {
    chunks: chunks.map((chunk, index) => ({
      content: chunk.pageContent,
      metadata: {
        source: fileName,
        page: chunk.metadata.loc?.pageNumber,
        chunk: index,
      },
    })),
    totalChunks: chunks.length,
    metadata: {
      fileName,
      fileType: "pdf",
      fileSize: buffer.length,
      pageCount: data.numpages,
    },
  };
}

/**
 * Process a text file
 */
export async function processText(
  content: string,
  fileName: string,
  fileType: string
): Promise<ProcessedDocument> {
  const chunks = await textSplitter.createDocuments(
    [content],
    [{ source: fileName }]
  );

  return {
    chunks: chunks.map((chunk, index) => ({
      content: chunk.pageContent,
      metadata: {
        source: fileName,
        chunk: index,
      },
    })),
    totalChunks: chunks.length,
    metadata: {
      fileName,
      fileType,
      fileSize: Buffer.byteLength(content, "utf8"),
    },
  };
}

/**
 * Process a document based on its type
 */
export async function processDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ProcessedDocument> {
  if (mimeType === "application/pdf") {
    return processPDF(buffer, fileName);
  }

  // For text-based files
  const content = buffer.toString("utf8");
  const fileType = mimeType.includes("markdown") ? "markdown" : "text";
  return processText(content, fileName, fileType);
}

/**
 * Create embeddings for a processed document and store in Pinecone
 */
export async function embedDocument(
  processedDoc: ProcessedDocument,
  namespace: string
): Promise<EmbeddingResult> {
  try {
    const documents = processedDoc.chunks.map(
      (chunk) =>
        new Document({
          pageContent: chunk.content,
          metadata: chunk.metadata,
        })
    );

    await createVectorStore(documents, namespace);

    return {
      namespace,
      chunkCount: processedDoc.totalChunks,
      success: true,
    };
  } catch (error) {
    return {
      namespace,
      chunkCount: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process and embed a document in one step
 */
export async function processAndEmbedDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  namespace: string
): Promise<EmbeddingResult> {
  const processed = await processDocument(buffer, fileName, mimeType);
  return embedDocument(processed, namespace);
}
