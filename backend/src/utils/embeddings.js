import openai from "../config/openai.js";

/**
 * Generates embeddings for an array of chunks with respect to file
 * @params {Array,File} - Array of text chunks and the file object
 * @returns {Array} - Array of embeddings corresponding to the input chunks
 */
export const generateEmbeddingsWRTFile = async (chunks, file) => {
  const embeddings = await Promise.all(
    chunks.map((chunk, index) => generateEmbeddingOfChunk(chunk, index, file))
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

const generateEmbeddingOfChunk = async (chunk, index, file) => {
  const response = await generateEmbedding(chunk);
  return {
    id: `${file.filename}_${index}`,
    values: response,
    metadata: {
      text: chunk,
      fileId: file.filename,
      filename: file.originalname,
      chunkIndex: index,
    },
  };
};
