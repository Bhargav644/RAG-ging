# Hybrid Search with BM25 + Reranking - Design Document

**Date:** 2025-12-22
**Goal:** Enhance RAG system with hybrid search combining vector similarity and keyword matching for improved retrieval accuracy and resume impact.

## Overview

Transform the existing pure vector search RAG into a hybrid search system that combines:
- Semantic vector search (existing OpenAI embeddings + Pinecone)
- BM25 keyword search (new)
- Reciprocal Rank Fusion for result combination
- Score-based reranking for final results

## Architecture

```
User Query
    ↓
    ├─→ Vector Search (existing) → top 10 results
    ├─→ BM25 Search (new) → top 10 results
    ↓
Reciprocal Rank Fusion
    ↓
Combined & ranked results (top 10)
    ↓
Score-based reranking (top 5)
    ↓
Final results to GPT-4 + UI with method attribution
```

## Component Details

### 1. BM25 Implementation

**Indexing (during PDF upload):**

Enhanced Pinecone metadata per chunk:
```javascript
{
  text: "chunk content...",
  chunkIndex: 0,
  fileId: "abc123",
  // NEW fields:
  tokens: ["retrieval", "augmented", "generation", ...],
  termFrequencies: { "retrieval": 2, "augmented": 1, ... },
  docLength: 150,
  avgDocLength: 200
}
```

**BM25 Formula:**
```
score = Σ(IDF(term) × (tf × (k1 + 1)) / (tf + k1 × (1 - b + b × (docLen / avgDocLen))))

Parameters: k1=1.5, b=0.75
```

**Tokenization:**
- Lowercase transformation
- Punctuation removal
- Whitespace split
- No stemming (keep simple)

**Search Process:**
1. Tokenize query
2. Fetch chunks from Pinecone (fileId filtered)
3. Compute BM25 scores in-memory from metadata
4. Return top 10 by BM25 score

### 2. Reciprocal Rank Fusion (RRF)

**Algorithm:**
```javascript
RRF_score(doc) = Σ(1 / (k + rank_in_method))
where k = 60 (standard constant)
```

**Why RRF:**
- No score normalization needed
- Handles different scoring scales naturally
- Research-proven effectiveness
- Computationally cheap

### 3. Score-based Reranking

**Final scoring formula:**
```javascript
finalScore = (
  0.4 × RRF_score +
  0.3 × vector_similarity +
  0.2 × BM25_normalized +
  0.1 × position_penalty
)
```

**Components:**
- RRF_score: Combined ranking signal
- vector_similarity: Cosine similarity from Pinecone
- BM25_normalized: BM25 score normalized to [0,1]
- position_penalty: Slight boost for earlier chunks (helps with context flow)

### 4. UI Enhancements

**Source attribution:**

Each result shows which method found it:

```typescript
interface Source {
  chunkIndex: number;
  score: number; // final reranked score
  text: string;
  foundBy: 'hybrid' | 'semantic' | 'keyword';
  vectorScore?: number;
  bm25Score?: number;
  matchedTerms?: string[];
}
```

**Badge system:**
- 🎯 **Hybrid** - Found by both methods (highest confidence)
- 🔍 **Semantic** - Only vector search
- 📝 **Keyword** - Only BM25

**Interactive features:**
- Hover tooltips showing score breakdown
- Keyword highlighting in chunk text
- Search insights component showing method distribution

## Storage Strategy

**No new database needed:**
- Store BM25 metadata in existing Pinecone chunks
- Compute BM25 scores in-memory during query
- Fast enough for typical document sizes (<1000 chunks)

## Benefits

**Technical advantages:**
- Handles exact term queries (names, dates, technical terms)
- Better recall through complementary search methods
- Measurable improvement over pure vector search

**Resume impact:**
- Buzzwords: Hybrid Search, BM25, Reciprocal Rank Fusion, Reranking
- Demonstrates information retrieval knowledge beyond basic RAG
- Shows system design and algorithm implementation skills

**API efficiency:**
- Minimal OpenAI API usage (only for existing embeddings + GPT-4)
- BM25 is pure computation
- Reranking uses heuristics (no API calls)

## Implementation Scope

**Estimated time:** 3-5 hours

**Files to modify:**
- `backend/src/utils/bm25.js` (new)
- `backend/src/utils/fusion.js` (new)
- `backend/src/utils/reranker.js` (new)
- `backend/src/upload/controllers/uploadController.js` (enhance metadata)
- `backend/src/chat/controllers/chatController.js` (integrate hybrid search)
- `frontend/src/app/types.ts` (add source attribution)
- `frontend/src/app/components/chat/ChatMessage.tsx` (add badges)

**Testing approach:**
- Test with queries that need keyword matching (e.g., "find all mentions of 'GPT-4'")
- Compare results before/after for same queries
- Verify performance with ~500-1000 chunk documents

## Future Enhancements

- Cross-encoder reranking with transformers.js
- Semantic chunking instead of fixed-size
- Query expansion with synonyms
- Cache BM25 index in Redis for multi-user scenarios
