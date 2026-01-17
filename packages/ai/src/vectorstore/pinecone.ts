import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = (): Pinecone => {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not set");
    }
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
};

export const getPineconeIndex = () => {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX;
  if (!indexName) {
    throw new Error("PINECONE_INDEX is not set");
  }
  return client.Index(indexName);
};

export const getEmbeddings = (): OpenAIEmbeddings => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });
};

export const getVectorStore = async (
  namespace: string
): Promise<PineconeStore> => {
  const index = getPineconeIndex();
  const embeddings = getEmbeddings();

  return PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace,
  });
};

export const createVectorStore = async (
  documents: Document[],
  namespace: string
): Promise<PineconeStore> => {
  const index = getPineconeIndex();
  const embeddings = getEmbeddings();

  return PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex: index,
    namespace,
  });
};

export const deleteNamespace = async (namespace: string): Promise<void> => {
  const index = getPineconeIndex();
  await index.namespace(namespace).deleteAll();
};

export const getNamespaceStats = async (
  namespace: string
): Promise<{ vectorCount: number }> => {
  const index = getPineconeIndex();
  const stats = await index.describeIndexStats();
  const namespaceStats = stats.namespaces?.[namespace];
  return {
    vectorCount: namespaceStats?.recordCount || 0,
  };
};
