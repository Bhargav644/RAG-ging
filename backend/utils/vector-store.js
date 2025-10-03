// utils/vectorStore.js
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export async function getVectorStore(collectionName = "uploaded-documents") {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return new QdrantVectorStore(embeddings, {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collectionName,
  });
}
