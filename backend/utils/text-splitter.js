// utils/textSplitter.js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitIntoChunks(docs, chunkSize = 1000, chunkOverlap = 200) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  return await textSplitter.splitDocuments(docs);
}
