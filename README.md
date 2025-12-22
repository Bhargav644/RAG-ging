# RAG-ging

> AI-powered PDF chat application using Retrieval-Augmented Generation (RAG) architecture

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-green)](https://openai.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-orange)](https://www.pinecone.io/)

## Features

🤖 **AI-Powered Chat** - Interact with PDF documents using natural language
🎯 **Hybrid Search** - Combines semantic (vector) and keyword (BM25) search for superior retrieval accuracy
🔍 **Advanced Ranking** - Reciprocal Rank Fusion + score-based reranking for optimal result ordering
🔐 **Secure Authentication** - Clerk integration for user management
⚡ **Real-time Responses** - Fast RAG pipeline with GPT-4 mini
📊 **Smart Source Attribution** - Visual badges showing search method (Hybrid/Semantic/Keyword) with confidence scores
🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

**Frontend:**
- Next.js 15 (React 19, App Router)
- TypeScript
- Tailwind CSS
- Clerk Authentication

**Backend:**
- Node.js & Express.js
- OpenAI API (Embeddings + GPT-4)
- Pinecone Vector Database
- Multer (File uploads)
- LangChain

## Architecture

### Hybrid Search RAG Pipeline

```
PDF Upload → Text Extraction → Chunking → [Vector Embeddings + BM25 Metadata] → Pinecone Storage

User Query
    ↓
    ├─→ Vector Search (OpenAI Embeddings) → Top 10 results
    ├─→ BM25 Keyword Search → Top 10 results
    ↓
Reciprocal Rank Fusion (RRF)
    ↓
Score-based Reranking → Top 5 results
    ↓
GPT-4 Response with Source Attribution
```

**Key Algorithms:**
- **BM25**: Best Match 25 ranking function for keyword-based search
- **RRF**: Reciprocal Rank Fusion combines rankings from multiple search methods
- **Reranking**: Weighted scoring using RRF, vector similarity, BM25, and position signals

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Pinecone account ([Sign up free](https://www.pinecone.io/))
- Clerk account for auth ([Get started](https://clerk.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/Bhargav644/RAG-ging.git
cd RAG-ging
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file from template
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=9000
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=rag-documents
NODE_ENV=development
```

**Create Pinecone Index:**
1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create new index named `rag-documents`
3. Set dimensions: `1536` (OpenAI embedding size)
4. Metric: `cosine`

Start backend:
```bash
npm run dev
# Backend runs on http://localhost:9000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

Start frontend:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Usage

1. Open [http://localhost:3000](http://localhost:3000)
2. Sign in with Clerk
3. Upload a PDF document
4. Start chatting with your PDF!

## Project Structure

```
RAG-ging/
├── backend/
│   ├── src/
│   │   ├── chat/          # Chat controllers & routes
│   │   ├── upload/        # File upload handlers
│   │   ├── config/        # Pinecone, OpenAI config
│   │   ├── utils/         # Chunking, embeddings, RAG
│   │   └── app.js         # Express app setup
│   ├── server.js          # Server entry point
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── components/    # React components
│   │   ├── lib/           # API client
│   │   └── page.tsx       # Main page
│   └── package.json
└── docker-compose.yml     # Optional: Qdrant & Valkey
```

## API Endpoints

### Backend (Port 9000)

- `GET /health` - Health check
- `POST /rag/upload` - Upload PDF file
- `POST /rag/chat` - Send chat query

## Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set root directory: `/backend`
4. Add environment variables
5. Deploy!

### Frontend (Vercel)

1. Connect GitHub repository
2. Framework: Next.js
3. Root directory: `/frontend`
4. Add environment variables
5. Deploy!

## Environment Variables

**Backend:**
- `PORT` - Server port (default: 9000)
- `OPENAI_API_KEY` - OpenAI API key
- `PINECONE_API_KEY` - Pinecone API key
- `PINECONE_INDEX_NAME` - Pinecone index name
- `NODE_ENV` - Environment (development/production)

**Frontend:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

## Hybrid Search Implementation

### Why Hybrid Search?

Traditional RAG systems using only vector search can miss important results when users search for:
- Exact terms, names, or technical jargon
- Dates, numbers, or specific identifiers
- Rare words that don't have strong semantic embeddings

Our hybrid approach combines the best of both worlds:

**Vector Search (Semantic)**
- Understands meaning and context
- Finds conceptually similar content
- Great for natural language queries

**BM25 Search (Keyword)**
- Matches exact terms and phrases
- Excels at finding specific names/dates
- Proven information retrieval algorithm

### Technical Highlights

1. **BM25 Implementation** (`backend/src/utils/bm25.js`)
   - Tokenization with punctuation handling
   - TF-IDF based scoring with k1=1.5, b=0.75
   - Metadata stored in Pinecone (no separate index needed)

2. **Reciprocal Rank Fusion** (`backend/src/utils/fusion.js`)
   - Combines rankings from both search methods
   - No score normalization required
   - Research-proven effectiveness

3. **Score-based Reranking** (`backend/src/utils/reranker.js`)
   - Weighted combination: RRF (40%) + Vector (30%) + BM25 (20%) + Position (10%)
   - Final ranking optimization for top-K results

4. **Visual Attribution** (`frontend/src/app/components/chat/ChatMessage.tsx`)
   - 🎯 Hybrid badge - Found by both methods
   - 🔍 Semantic badge - Vector search only
   - 📝 Keyword badge - BM25 only
   - Matched terms highlighting
   - Score breakdowns for transparency

### Performance

- **API Efficiency**: BM25 computation is pure algorithm (no extra API calls)
- **Speed**: In-memory BM25 scoring adds <50ms latency
- **Quality**: Measurably better recall compared to vector-only search

## Future Enhancements

- [ ] Migration to Qdrant (self-hosted vector DB)
- [ ] BullMQ queue system for async processing
- [ ] Conversation history persistence
- [ ] Multi-document chat sessions
- [ ] Advanced PDF parsing (tables, images)
- [ ] Rate limiting & usage analytics

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

---

Built with ❤️ using Next.js, OpenAI, and Pinecone
