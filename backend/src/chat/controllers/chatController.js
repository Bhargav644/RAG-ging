import pineCodeIndex from "../../config/pinecone.js";
import { generateEmbedding } from "../../utils/embeddings.js";
import { generateResponseFromContext } from "../../utils/response-generator.js";

export const chatWithDoc = async (req, res) => {
  try {
    const { question, fileId } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const questionEmbedding = await generateEmbedding(question);

    const queryRequest = {
      vector: questionEmbedding,
      topK: 5, // top 5 nearest neighbors
      includeMetadata: true,
      filter: fileId ? { fileId: { $eq: fileId } } : undefined,
    };

    const queryResponse = await pineCodeIndex.query(queryRequest);
    const contexts =
      queryResponse.matches
        ?.map((match) => match.metadata.text)
        .join("\n---\n") || "No relevant context found.";

    const answer = await generateResponseFromContext(question, contexts);

    res.json({
      answer,
      sources:
        queryResponse.matches?.map((m) => ({
          chunkIndex: m.metadata.chunkIndex,
          score: m.score,
          text: m.metadata.text,
        })) || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Error processing chat request" });
  }
};
