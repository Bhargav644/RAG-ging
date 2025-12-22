import pineCodeIndex from "../../config/pinecone.js";
import { generateEmbedding } from "../../utils/embeddings.js";
import { generateResponseFromContext } from "../../utils/response-generator.js";
import { rankDocumentsBM25 } from "../../utils/bm25.js";
import { fuseResults, formatFusedResults } from "../../utils/fusion.js";
import { getTopKReranked } from "../../utils/reranker.js";

/**
 * Processes chat queries using Hybrid Search RAG (Vector + BM25 + Reranking)
 * @param {import('express').Request} req - Express request with question in body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>} JSON response with AI answer and source chunks
 */
export const chatWithDoc = async (req, res) => {
  try {
    const { question, fileId } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Step 1: Vector search (semantic)
    const questionEmbedding = await generateEmbedding(question);

    const vectorQueryRequest = {
      vector: questionEmbedding,
      topK: 10, // Get top 10 for fusion
      includeMetadata: true,
      filter: fileId ? { fileId: { $eq: fileId } } : undefined,
    };

    const vectorResults = await pineCodeIndex.query(vectorQueryRequest);

    // Step 2: Fetch all chunks for BM25 search
    // We need to get all chunks to compute BM25 scores
    const allChunksQuery = {
      vector: questionEmbedding, // Required by Pinecone
      topK: 10000, // Large number to get all chunks
      includeMetadata: true,
      filter: fileId ? { fileId: { $eq: fileId } } : undefined,
    };

    const allChunksResponse = await pineCodeIndex.query(allChunksQuery);

    // Convert Pinecone results to format needed for BM25
    // Parse termFrequencies from JSON string back to object
    const documentsForBM25 = allChunksResponse.matches?.map(match => ({
      ...match.metadata,
      termFrequencies: match.metadata.termFrequencies
        ? JSON.parse(match.metadata.termFrequencies)
        : {},
      pineconeScore: match.score
    })) || [];

    // Step 3: BM25 keyword search
    const bm25Results = rankDocumentsBM25(question, documentsForBM25);

    // Step 4: Fuse results using Reciprocal Rank Fusion
    const fusedResults = fuseResults(
      vectorResults.matches || [],
      bm25Results.slice(0, 10), // Top 10 BM25 results
      10 // Return top 10 fused results
    );

    const formattedFused = formatFusedResults(fusedResults);

    // Step 5: Rerank the fused results
    const rerankedResults = getTopKReranked(formattedFused, 5);

    // Step 6: Generate response from top results
    const contexts = rerankedResults
      .map((result) => result.text)
      .join("\n---\n") || "No relevant context found.";

    const answer = await generateResponseFromContext(question, contexts);

    // Step 7: Format sources with attribution
    const sources = rerankedResults.map((result) => ({
      chunkIndex: result.chunkIndex,
      score: result.finalScore,
      text: result.text,
      foundBy: result.foundBy,
      vectorScore: result.vectorScore,
      bm25Score: result.bm25Score,
      matchedTerms: result.matchedTerms || [],
    }));

    res.json({
      answer,
      sources,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      message: "Error processing chat request",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};
