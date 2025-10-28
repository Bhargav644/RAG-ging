# RAG-ging - Project Context Guide

> Quick reference for understanding and navigating the RAG-based chatbot codebase

## 📋 Project Overview

**RAG-ging** is a Retrieval-Augmented Generation (RAG) chatbot that enables users to chat with uploaded documents (PDFs, DOCX, TXT, CSV, JSON). It uses OpenAI's API for embeddings and chat completions, Qdrant as a vector database, and BullMQ for asynchronous file processing.

**Core Functionality:**
1. User uploads a document via the frontend
2. File is queued and processed asynchronously by a BullMQ worker
3. Document is chunked and embedded, then stored in Qdrant vector DB
4. User asks questions; relevant chunks are retrieved and sent to OpenAI for context-aware responses

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.3.1 with React 19
- **Styling:** Tailwind CSS 4.1.4
- **Authentication:** Clerk (@clerk/nextjs)
- **Language:** TypeScript
- **Dev Server:** http://localhost:3000

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4.x
- **File Processing:** Multer (multipart/form-data uploads)
- **Queue System:** BullMQ (Redis-backed job queue)
- **AI/ML Libraries:**
  - LangChain (@langchain/*)
  - OpenAI SDK
  - Document Loaders: PDFLoader, TextLoader, DocxLoader, CSVLoader, JSONLoader
  - Text Splitter: RecursiveCharacterTextSplitter
- **Vector Database:** Qdrant (@langchain/qdrant)
- **API Server:** http://localhost:8000

### Infrastructure
- **Vector DB:** Qdrant (port 6333)
- **Redis:** Valkey (Redis-compatible, port 6379)
- **Orchestration:** Docker Compose

---

## 🏗️ Architecture Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  BullMQ     │
│  (Next.js)  │      │  (Express)  │      │   Queue     │
└─────────────┘      └─────────────┘      └─────────────┘
                            │                      │
                            │                      ▼
                            │              ┌─────────────┐
                            │              │   Worker    │
                            │              │  Process    │
                            │              └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌─────────────┐      ┌─────────────┐
                     │   OpenAI    │      │   Qdrant    │
                     │     API     │      │  Vector DB  │
                     └─────────────┘      └─────────────┘
```

---

## 📂 Directory Structure

```
RAG-ging/
├── backend/
│   ├── index.js                    # Express server & API routes
│   ├── loaders/
│   │   └── file-loader.js         # Document loaders (PDF, DOCX, TXT, CSV, JSON)
│   ├── utils/
│   │   ├── text-splitter.js       # Recursive text chunking
│   │   └── vector-store.js        # Qdrant vector store initialization
│   ├── worker/
│   │   └── file-worker.js         # BullMQ worker for async file processing
│   ├── uploads/                   # Temporary file storage
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables (not tracked)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main app page (file upload + chat)
│   │   │   ├── layout.tsx         # Root layout with Clerk provider
│   │   │   ├── globals.css        # Global styles
│   │   │   └── components/
│   │   │       ├── auth/
│   │   │       │   ├── LoginButtons.tsx
│   │   │       │   └── UserProfileButton.tsx
│   │   │       ├── chat/
│   │   │       │   ├── ChatInterface.tsx    # Chat container
│   │   │       │   ├── ChatMessage.tsx      # Message bubble component
│   │   │       │   └── ChatInput.tsx        # Message input field
│   │   │       ├── landing/
│   │   │       │   └── WelcomeScreen.tsx    # Landing page (signed out)
│   │   │       ├── layout/
│   │   │       │   ├── Header.tsx
│   │   │       │   └── Footer.tsx
│   │   │       └── pdf/
│   │   │           ├── PDFUploader.tsx      # File upload component
│   │   │           └── ProcessingIndicator.tsx
│   │   └── middleware.ts          # Clerk authentication middleware
│   ├── package.json               # Frontend dependencies
│   └── next.config.ts             # Next.js configuration
│
├── docker-compose.yml             # Qdrant + Valkey services
├── README.md                      # Setup instructions
└── context.md                     # This file
```

---

## 🗂️ Key Files Reference

| File Path | Purpose |
|-----------|---------|
| `backend/index.js:36-47` | `/upload` endpoint - receives file, enqueues job |
| `backend/index.js:49-73` | `/chat` endpoint - retrieves context, queries OpenAI |
| `backend/worker/file-worker.js:18-64` | BullMQ worker - loads, chunks, embeds, stores documents |
| `backend/loaders/file-loader.js:11-36` | File type detection & loading logic |
| `backend/utils/text-splitter.js:4-10` | Text chunking with overlap (1000 chars, 200 overlap) |
| `backend/utils/vector-store.js:13-22` | Qdrant vector store factory function |
| `frontend/src/app/page.tsx:18-35` | File upload handler & state management |
| `frontend/src/app/page.tsx:37-77` | Chat message handler & API calls |
| `frontend/src/app/components/pdf/PDFUploader.tsx` | File upload UI component |
| `frontend/src/app/components/chat/ChatInterface.tsx` | Chat UI container |
| `docker-compose.yml` | Qdrant (6333) + Valkey (6379) service definitions |

---

## 🔌 API Endpoints

### `POST /upload`
- **Purpose:** Upload a document for processing
- **Body:** `multipart/form-data` with `file` field
- **Flow:**
  1. Multer saves file to `uploads/` directory
  2. Job added to `Upload-File-Queue` with file metadata
  3. Returns immediately with success message
- **Response:** `{ message: "File uploaded successfully" }`

### `GET /chat`
- **Purpose:** Query the uploaded documents
- **Query Params:** `query` (string)
- **Flow:**
  1. Retrieves top 3 relevant chunks from Qdrant
  2. Constructs prompt with retrieved context
  3. Sends to OpenAI GPT-4.1
  4. Returns AI response + source documents
- **Response:** `{ answer: string, docs: Document[] }`

---

## 🔄 Data Flow Explained

### Upload Flow
```
1. User selects file in PDFUploader component
2. Frontend sends POST to /upload with FormData
3. Multer saves file to backend/uploads/
4. Job added to BullMQ queue: { filename, filepath, destination }
5. Worker picks up job from queue
6. Worker loads file using appropriate loader (PDFLoader, TextLoader, etc.)
7. Document split into chunks (1000 chars, 200 overlap)
8. Each chunk embedded using OpenAI Embeddings
9. Chunks stored in Qdrant with metadata (filename, chunkIndex, documentId)
10. Job marked complete
```

### Chat Flow
```
1. User types question in ChatInput component
2. Frontend sends GET to /chat?query=...
3. Backend retrieves 3 most similar chunks from Qdrant (vector similarity search)
4. Backend constructs prompt: system message + retrieved context + user question
5. OpenAI API called with GPT-4.1 model
6. AI generates context-aware answer
7. Response sent back to frontend with answer + source docs
8. ChatMessage component renders AI response
```

---

## 🐳 Docker Services

Defined in `docker-compose.yml`:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **qdrant** | `qdrant/qdrant` | 6333 | Vector database for embeddings |
| **valkey** | `valkey/valkey` | 6379 | Redis-compatible store for BullMQ |

**Start services:**
```bash
docker compose up -d
```

---

## 🔐 Environment Variables

Create `backend/.env` with:

```env
OPENAI_API_KEY=sk-...              # Required: OpenAI API key
QDRANT_URL=http://localhost:6333  # Optional: defaults to this value
```

---

## 🎨 Frontend Component Map

```
components/
├── auth/                   # Authentication UI
│   ├── LoginButtons        # Sign in/up buttons (Clerk)
│   └── UserProfileButton   # User menu dropdown
├── chat/                   # Chat functionality
│   ├── ChatInterface       # Main chat container
│   ├── ChatMessage         # Individual message bubbles
│   └── ChatInput           # Message input field
├── landing/                # Public pages
│   └── WelcomeScreen       # Landing page for signed-out users
├── layout/                 # Layout components
│   ├── Header              # Top navigation bar
│   └── Footer              # Footer section
└── pdf/                    # Document upload
    ├── PDFUploader         # File upload widget
    └── ProcessingIndicator # Loading spinner for file processing
```

---

## 🚀 Development Commands

### Frontend
```bash
cd frontend
yarn install
yarn dev          # Start Next.js dev server on :3000
yarn build        # Production build
yarn lint         # ESLint
```

### Backend
```bash
cd backend
yarn install
yarn dev          # Start API server on :8000
yarn dev:worker   # Start BullMQ worker process
```

**Note:** Both `yarn dev` and `yarn dev:worker` must run concurrently for full functionality.

---

## 📦 Key Dependencies

### Backend
- **@langchain/community** - Document loaders (PDF, DOCX, CSV)
- **@langchain/openai** - OpenAI embeddings & chat
- **@langchain/qdrant** - Qdrant vector store integration
- **@langchain/textsplitters** - Text chunking utilities
- **bullmq** - Redis-backed job queue
- **multer** - File upload middleware
- **openai** - OpenAI API client
- **pdf-parse** - PDF text extraction

### Frontend
- **@clerk/nextjs** - Authentication & user management
- **next** - React framework with SSR/SSG
- **react** - UI library
- **tailwindcss** - Utility-first CSS framework

---

## 🧩 LangChain Integration

### Document Loading
- **PDFLoader** - Extracts text from PDF files
- **TextLoader** - Loads plain text files
- **DocxLoader** - Parses Word documents
- **CSVLoader** - Reads CSV files
- **JSONLoader** - Parses JSON data

### Text Processing
- **RecursiveCharacterTextSplitter** - Splits documents into chunks with overlap
  - Chunk Size: 1000 characters
  - Overlap: 200 characters
  - Preserves semantic boundaries (paragraphs, sentences)

### Vector Store
- **QdrantVectorStore** - Manages embeddings and similarity search
  - Collection: `"uploaded-documents"`
  - Embeddings: OpenAI text-embedding-3-small (default)
  - Retrieval: Top-k similarity search (k=3)

---

## 🔍 Common Patterns

### Adding a New Document Type
1. Update `backend/loaders/file-loader.js` with new case in switch statement
2. Import appropriate LangChain loader
3. Add file extension to supported types

### Debugging Upload Issues
- Check `backend/uploads/` directory for saved files
- Monitor worker logs: `yarn dev:worker`
- Verify Qdrant connection: `http://localhost:6333/dashboard`
- Check BullMQ queue in Redis: Connect to Valkey on port 6379

### Modifying Chat Behavior
- **Prompt engineering:** Edit `backend/index.js:56-59`
- **Retrieval count:** Change `k` parameter in `index.js:52`
- **Model selection:** Modify `model` in `index.js:62`

---

## 🎯 Quick Navigation Tips

**Finding authentication logic?** → `frontend/src/app/components/auth/`
**Finding file upload handling?** → `backend/index.js:36` + `backend/worker/file-worker.js`
**Finding chat API?** → `backend/index.js:49`
**Finding vector store config?** → `backend/utils/vector-store.js`
**Finding chunking logic?** → `backend/utils/text-splitter.js`
**Finding UI components?** → `frontend/src/app/components/`
**Finding Docker services?** → `docker-compose.yml`

---

## 📝 Notes

- **Queue Concurrency:** Worker processes up to 5 jobs concurrently (`file-worker.js:63`)
- **Model:** Currently using `gpt-4.1` (may need to verify model availability)
- **Authentication:** Uses Clerk for user management (keyless mode for dev)
- **File Storage:** Uploaded files stored temporarily in `backend/uploads/`
- **Collection Name:** All documents stored in `"uploaded-documents"` collection in Qdrant

---

**Last Updated:** 2025-10-08
**Project Status:** Backend operational, frontend integrated with Clerk auth
