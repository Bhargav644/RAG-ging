/**
 * Score-based reranking module
 * Refines ranking of fused results using multiple signals
 */

/**
 * Normalize a score to [0, 1] range using min-max normalization
 * @param {number} score - Raw score
 * @param {number} min - Minimum score in dataset
 * @param {number} max - Maximum score in dataset
 * @returns {number} Normalized score
 */
const normalize = (score, min, max) => {
  if (max === min) return 1;
  return (score - min) / (max - min);
};

/**
 * Normalize BM25 scores to [0, 1] range
 * @param {Array} results - Results with bm25Score
 * @returns {Array} Results with normalized bm25Score
 */
const normalizeBM25Scores = (results) => {
  const bm25Scores = results
    .map(r => r.bm25Score)
    .filter(s => s !== null && s !== undefined);

  if (bm25Scores.length === 0) {
    return results.map(r => ({ ...r, bm25ScoreNorm: 0 }));
  }

  const minBM25 = Math.min(...bm25Scores);
  const maxBM25 = Math.max(...bm25Scores);

  return results.map(r => ({
    ...r,
    bm25ScoreNorm: r.bm25Score !== null && r.bm25Score !== undefined
      ? normalize(r.bm25Score, minBM25, maxBM25)
      : 0
  }));
};

/**
 * Normalize RRF scores to [0, 1] range
 * @param {Array} results - Results with rrfScore
 * @returns {Array} Results with normalized rrfScore
 */
const normalizeRRFScores = (results) => {
  const rrfScores = results.map(r => r.score);
  const minRRF = Math.min(...rrfScores);
  const maxRRF = Math.max(...rrfScores);

  return results.map(r => ({
    ...r,
    rrfScoreNorm: normalize(r.score, minRRF, maxRRF)
  }));
};

/**
 * Calculate position penalty (slight preference for earlier chunks)
 * @param {number} chunkIndex - Chunk position in document
 * @param {number} totalChunks - Total number of chunks
 * @returns {number} Position score [0, 1]
 */
const calculatePositionScore = (chunkIndex, totalChunks) => {
  // Earlier chunks get slightly higher scores
  // Using logarithmic decay to avoid over-emphasizing position
  const position = chunkIndex + 1; // 1-indexed
  return 1 - Math.log(position) / Math.log(totalChunks + 1);
};

/**
 * Rerank results using weighted combination of signals
 * @param {Array} fusedResults - Results from fusion step
 * @param {Object} weights - Weighting factors for different signals
 * @returns {Array} Reranked results
 */
export const rerankResults = (fusedResults, weights = {}) => {
  if (!fusedResults || fusedResults.length === 0) {
    return [];
  }

  // Default weights (sum to 1.0)
  const {
    rrfWeight = 0.4,
    vectorWeight = 0.3,
    bm25Weight = 0.2,
    positionWeight = 0.1
  } = weights;

  // Normalize scores
  let normalized = normalizeRRFScores(fusedResults);
  normalized = normalizeBM25Scores(normalized);

  // Get total chunks for position scoring
  const maxChunkIndex = Math.max(...normalized.map(r => r.chunkIndex || 0));

  // Calculate final scores
  const reranked = normalized.map(result => {
    const vectorScoreNorm = result.vectorScore || 0; // Already normalized [0,1] from Pinecone
    const bm25ScoreNorm = result.bm25ScoreNorm || 0;
    const rrfScoreNorm = result.rrfScoreNorm || 0;
    const positionScore = calculatePositionScore(
      result.chunkIndex || 0,
      maxChunkIndex
    );

    // Weighted combination
    const finalScore =
      rrfWeight * rrfScoreNorm +
      vectorWeight * vectorScoreNorm +
      bm25Weight * bm25ScoreNorm +
      positionWeight * positionScore;

    return {
      ...result,
      finalScore,
      scoreBreakdown: {
        rrf: rrfScoreNorm,
        vector: vectorScoreNorm,
        bm25: bm25ScoreNorm,
        position: positionScore
      }
    };
  });

  // Sort by final score (descending)
  return reranked.sort((a, b) => b.finalScore - a.finalScore);
};

/**
 * Apply reranking and return top K results
 * @param {Array} fusedResults - Results from fusion step
 * @param {number} topK - Number of top results to return
 * @param {Object} weights - Optional custom weights
 * @returns {Array} Top K reranked results
 */
export const getTopKReranked = (fusedResults, topK = 5, weights = {}) => {
  const reranked = rerankResults(fusedResults, weights);
  return reranked.slice(0, topK);
};
