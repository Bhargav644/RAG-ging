/**
 * Reciprocal Rank Fusion (RRF) for combining multiple ranked lists
 * Combines results from different search methods (vector + BM25) into unified ranking
 */

// RRF constant - standard value from research
const K = 60;

/**
 * Calculate RRF score for a document based on its ranks in different methods
 * @param {Array<number>} ranks - Array of ranks (1-indexed) from different methods
 * @returns {number} RRF score (higher is better)
 */
const calculateRRFScore = (ranks) => {
  return ranks.reduce((score, rank) => {
    return score + (1 / (K + rank));
  }, 0);
};

/**
 * Fuse results from vector search and BM25 search using RRF
 * @param {Array} vectorResults - Results from vector search with scores
 * @param {Array} bm25Results - Results from BM25 search with scores
 * @param {number} topK - Number of top results to return
 * @returns {Array} Fused and ranked results
 */
export const fuseResults = (vectorResults, bm25Results, topK = 10) => {
  // Create maps for quick lookup
  const vectorMap = new Map();
  const bm25Map = new Map();

  // Index vector results by chunkIndex (1-indexed ranks)
  vectorResults.forEach((result, index) => {
    const key = `${result.metadata?.fileId || ''}_${result.metadata?.chunkIndex}`;
    vectorMap.set(key, {
      rank: index + 1,
      score: result.score || 0,
      data: result
    });
  });

  // Index BM25 results by chunkIndex (1-indexed ranks)
  bm25Results.forEach((result, index) => {
    const key = `${result.fileId || ''}_${result.chunkIndex}`;
    bm25Map.set(key, {
      rank: index + 1,
      score: result.bm25Score || 0,
      data: result
    });
  });

  // Get all unique documents
  const allKeys = new Set([...vectorMap.keys(), ...bm25Map.keys()]);

  // Calculate RRF scores
  const fusedResults = [];

  for (const key of allKeys) {
    const vectorEntry = vectorMap.get(key);
    const bm25Entry = bm25Map.get(key);

    const ranks = [];
    let foundBy = 'semantic';
    let vectorScore = null;
    let bm25Score = null;
    let matchedTerms = [];
    let resultData = null;

    // Determine which methods found this document
    if (vectorEntry && bm25Entry) {
      ranks.push(vectorEntry.rank, bm25Entry.rank);
      foundBy = 'hybrid';
      vectorScore = vectorEntry.score;
      bm25Score = bm25Entry.score;
      matchedTerms = bm25Entry.data.matchedTerms || [];
      resultData = vectorEntry.data; // Use vector data as base
    } else if (vectorEntry) {
      ranks.push(vectorEntry.rank);
      foundBy = 'semantic';
      vectorScore = vectorEntry.score;
      resultData = vectorEntry.data;
    } else if (bm25Entry) {
      ranks.push(bm25Entry.rank);
      foundBy = 'keyword';
      bm25Score = bm25Entry.score;
      matchedTerms = bm25Entry.data.matchedTerms || [];
      resultData = bm25Entry.data;
    }

    // Calculate RRF score
    const rrfScore = calculateRRFScore(ranks);

    fusedResults.push({
      key,
      rrfScore,
      foundBy,
      vectorScore,
      bm25Score,
      matchedTerms,
      resultData
    });
  }

  // Sort by RRF score (descending) and return top K
  return fusedResults
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, topK);
};

/**
 * Format fused results for downstream processing
 * @param {Array} fusedResults - Results from fuseResults()
 * @returns {Array} Formatted results ready for reranking/response generation
 */
export const formatFusedResults = (fusedResults) => {
  return fusedResults.map(result => {
    const metadata = result.resultData?.metadata || result.resultData || {};

    return {
      chunkIndex: metadata.chunkIndex,
      text: metadata.text || '',
      score: result.rrfScore,
      foundBy: result.foundBy,
      vectorScore: result.vectorScore,
      bm25Score: result.bm25Score,
      matchedTerms: result.matchedTerms,
      fileId: metadata.fileId
    };
  });
};
