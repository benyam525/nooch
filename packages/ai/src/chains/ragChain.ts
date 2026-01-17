import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getVectorStore } from "../vectorstore/pinecone";
import { COACH_RESPONSE_PROMPT } from "../prompts/responsePrompt";
import type { RAGInput, RAGOutput, SourceDocument } from "../types";

/**
 * Create a RAG chain for a specific coach's methodology
 */
export const createRAGChain = async (coachNamespace: string) => {
  const vectorStore = await getVectorStore(coachNamespace);
  const retriever = vectorStore.asRetriever({
    k: 4,
    searchType: "similarity",
  });

  const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = PromptTemplate.fromTemplate(COACH_RESPONSE_PROMPT);

  return { retriever, model, prompt };
};

/**
 * Generate an AI response using RAG
 */
export const generateResponse = async (input: RAGInput): Promise<RAGOutput> => {
  const { retriever, model, prompt } = await createRAGChain(
    input.coachNamespace
  );

  // Retrieve relevant documents
  const docs = await retriever.invoke(input.clientMessage);
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  // Generate response
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    context: context || "No specific methodology documents found.",
    clientMessage: input.clientMessage,
    clientContext: input.clientContext || "No additional context provided.",
    conversationHistory:
      input.conversationHistory || "This is the start of the conversation.",
  });

  // Calculate confidence based on retrieval quality
  const confidence = calculateConfidence(docs);

  // Format source documents
  const sourceDocs: SourceDocument[] = docs.map((doc) => ({
    content: doc.pageContent.substring(0, 200) + "...",
    metadata: doc.metadata,
  }));

  return {
    response,
    sourceDocs,
    confidence,
  };
};

/**
 * Calculate a confidence score based on retrieved documents
 */
function calculateConfidence(docs: any[]): number {
  if (docs.length === 0) {
    return 0.3; // Low confidence if no documents retrieved
  }

  // Base confidence on number of relevant documents found
  const baseConfidence = Math.min(0.5 + docs.length * 0.1, 0.9);

  return baseConfidence;
}

/**
 * Format conversation history for context
 */
export function formatConversationHistory(
  messages: Array<{ role: string; content: string }>
): string {
  if (messages.length === 0) {
    return "This is the start of the conversation.";
  }

  return messages
    .slice(-10) // Only use last 10 messages for context
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
}

/**
 * Format client context for the prompt
 */
export function formatClientContext(client: {
  firstName?: string | null;
  lastName?: string | null;
  goals?: string | null;
  preferences?: any;
}): string {
  const parts: string[] = [];

  if (client.firstName || client.lastName) {
    parts.push(
      `Client name: ${[client.firstName, client.lastName].filter(Boolean).join(" ")}`
    );
  }

  if (client.goals) {
    parts.push(`Goals: ${client.goals}`);
  }

  if (client.preferences) {
    parts.push(`Preferences: ${JSON.stringify(client.preferences)}`);
  }

  return parts.length > 0 ? parts.join("\n") : "No additional context.";
}
