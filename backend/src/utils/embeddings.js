import openai from "../config/openai.js";
import { prepareBM25Metadata } from "./bm25.js";

/**
 * Generates embeddings for an array of chunks with respect to file
 * @params {Array,File} - Array of text chunks and the file object
 * @returns {Array} - Array of embeddings corresponding to the input chunks
 */
export const generateEmbeddingsWRTFile = async (chunks, file) => {
  // Calculate average document length for BM25
  const totalTokens = chunks.reduce((sum, chunk) => {
    const metadata = prepareBM25Metadata(chunk);
    return sum + metadata.docLength;
  }, 0);
  const avgDocLength = chunks.length > 0 ? totalTokens / chunks.length : 0;

  const embeddings = await Promise.all(
    chunks.map((chunk, index) =>
      generateEmbeddingOfChunk(chunk, index, file, avgDocLength)
    )
  );
  return embeddings;
};

export const generateEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response?.data[0]?.embedding;
};

const generateEmbeddingOfChunk = async (chunk, index, file, avgDocLength) => {
  const response = await generateEmbedding(chunk);

  // Generate BM25 metadata for this chunk
  const bm25Metadata = prepareBM25Metadata(chunk);

  return {
    id: `${file.filename}_${index}`,
    values: response,
    metadata: {
      text: chunk,
      fileId: file.filename,
      filename: file.originalname,
      chunkIndex: index,
      // BM25 fields
      tokens: bm25Metadata.tokens,
      termFrequencies: bm25Metadata.termFrequencies,
      docLength: bm25Metadata.docLength,
      avgDocLength: avgDocLength,
    },
  };
};
