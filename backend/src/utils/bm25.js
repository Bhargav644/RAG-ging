/**
 * BM25 (Best Matching 25) ranking function for keyword-based search
 * Complements vector search with exact term matching capabilities
 */

// BM25 parameters
const K1 = 1.5; // Term frequency saturation parameter
const B = 0.75; // Length normalization parameter

/**
 * Tokenize text into searchable terms
 * @param {string} text - Input text to tokenize
 * @returns {string[]} Array of lowercase tokens
 */
export const tokenize = (text) => {
  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/) // Split on whitespace
    .filter(token => token.length > 0); // Remove empty strings
};

/**
 * Calculate term frequencies for a document
 * @param {string[]} tokens - Tokenized document
 * @returns {Object} Map of term -> frequency
 */
export const calculateTermFrequencies = (tokens) => {
  const frequencies = {};

  for (const token of tokens) {
    frequencies[token] = (frequencies[token] || 0) + 1;
  }

  return frequencies;
};

/**
 * Calculate Inverse Document Frequency (IDF) for query terms
 * @param {string[]} queryTerms - Terms from the query
 * @param {Array} documents - All documents with their tokens
 * @returns {Object} Map of term -> IDF score
 */
export const calculateIDF = (queryTerms, documents) => {
  const N = documents.length; // Total number of documents
  const idf = {};

  for (const term of queryTerms) {
    // Count documents containing this term
    const docsWithTerm = documents.filter(doc =>
      doc.tokens && doc.tokens.includes(term)
    ).length;

    // IDF formula: log((N - df + 0.5) / (df + 0.5) + 1)
    // Add smoothing to avoid division by zero
    idf[term] = Math.log((N - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1);
  }

  return idf;
};

/**
 * Calculate BM25 score for a document given a query
 * @param {string[]} queryTerms - Tokenized query
 * @param {Object} doc - Document with termFrequencies and docLength
 * @param {number} avgDocLength - Average document length in corpus
 * @param {Object} idf - IDF scores for query terms
 * @returns {number} BM25 score
 */
export const calculateBM25Score = (queryTerms, doc, avgDocLength, idf) => {
  if (!doc.termFrequencies || !doc.docLength) {
    return 0;
  }

  let score = 0;
  const docLength = doc.docLength;

  for (const term of queryTerms) {
    const tf = doc.termFrequencies[term] || 0;

    if (tf === 0) continue; // Term not in document

    const termIDF = idf[term] || 0;

    // BM25 formula
    const numerator = tf * (K1 + 1);
    const denominator = tf + K1 * (1 - B + B * (docLength / avgDocLength));

    score += termIDF * (numerator / denominator);
  }

  return score;
};

/**
 * Rank documents using BM25 algorithm
 * @param {string} query - User query
 * @param {Array} documents - Array of documents with metadata
 * @returns {Array} Documents sorted by BM25 score (highest first)
 */
export const rankDocumentsBM25 = (query, documents) => {
  if (!query || !documents || documents.length === 0) {
    return [];
  }

  // Tokenize query
  const queryTerms = tokenize(query);

  if (queryTerms.length === 0) {
    return [];
  }

  // Calculate average document length
  const avgDocLength = documents.reduce((sum, doc) =>
    sum + (doc.docLength || 0), 0
  ) / documents.length;

  // Calculate IDF for query terms
  const idf = calculateIDF(queryTerms, documents);

  // Score each document
  const scoredDocs = documents.map(doc => ({
    ...doc,
    bm25Score: calculateBM25Score(queryTerms, doc, avgDocLength, idf),
    matchedTerms: queryTerms.filter(term =>
      doc.termFrequencies && doc.termFrequencies[term] > 0
    )
  }));

  // Sort by BM25 score (descending)
  return scoredDocs
    .filter(doc => doc.bm25Score > 0) // Only keep docs with matches
    .sort((a, b) => b.bm25Score - a.bm25Score);
};

/**
 * Prepare document metadata for BM25 indexing
 * @param {string} text - Document text
 * @returns {Object} Metadata for storing with document
 */
export const prepareBM25Metadata = (text) => {
  const tokens = tokenize(text);
  const termFrequencies = calculateTermFrequencies(tokens);

  return {
    tokens,
    termFrequencies,
    docLength: tokens.length
  };
};
