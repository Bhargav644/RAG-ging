# RAG-ging Deployment Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform RAG-ging into a resume-worthy, deployment-ready PDF chat application

**Architecture:** Full-stack RAG application with Next.js frontend, Express backend, OpenAI for embeddings/chat, and Pinecone vector database. Focus on fixing port mismatches, adding proper error handling, improving UX, and creating professional documentation.

**Tech Stack:** Next.js 15, React 19, Express.js, OpenAI API, Pinecone, Clerk Auth, Tailwind CSS

---

## Task 1: Fix Backend Port Configuration

**Files:**
- Modify: `backend/server.js:6`
- Modify: `backend/package.json:8`

**Step 1: Update server.js port default**

Change line 6 in `backend/server.js` from:
```javascript
const PORT = process.env.PORT || 3000;
```

To:
```javascript
const PORT = process.env.PORT || 9000;
```

**Step 2: Update dev script with correct port**

Update `backend/package.json` scripts section:
```json
"scripts": {
  "dev": "PORT=9000 node --watch server.js",
  "dev:worker": "node --watch ./worker/file-worker.js",
  "start": "node server.js"
}
```

**Step 3: Test backend starts on port 9000**

Run: `cd backend && npm run dev`
Expected: Console shows "Server running on http://localhost:9000"

**Step 4: Commit**

```bash
git add backend/server.js backend/package.json
git commit -m "fix: set backend default port to 9000"
```

---

## Task 2: Create Backend Environment Template

**Files:**
- Create: `backend/.env.example`
- Modify: `backend/.gitignore`

**Step 1: Create .env.example file**

Create `backend/.env.example`:
```env
# Server Configuration
PORT=9000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=rag-documents
```

**Step 2: Ensure .env is gitignored**

Check if `backend/.gitignore` exists and contains `.env`. If not, create/update:
```
node_modules/
.env
file-uploads/
.claude/
```

**Step 3: Verify .env is not tracked**

Run: `cd backend && git status`
Expected: .env file should not appear in untracked/staged files

**Step 4: Commit**

```bash
git add backend/.env.example backend/.gitignore
git commit -m "docs: add backend environment template"
```

---

## Task 3: Update Frontend API Configuration

**Files:**
- Modify: `frontend/src/app/lib/api.ts:6-7`
- Modify: `frontend/.env.example`

**Step 1: Make API URLs environment-based**

Update `frontend/src/app/lib/api.ts` lines 6-7:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";
const UPLOAD_API_URL = `${API_BASE_URL}/rag/upload`;
const CHAT_API_URL = `${API_BASE_URL}/rag/chat`;
```

**Step 2: Update frontend .env.example**

Check `frontend/.env.example` and ensure it has:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

**Step 3: Test configuration**

Run: `cd frontend && npm run dev`
Expected: Frontend should compile without errors

**Step 4: Commit**

```bash
git add frontend/src/app/lib/api.ts frontend/.env.example
git commit -m "feat: make backend URL configurable via environment variable"
```

---

## Task 4: Remove Auth Token from Upload (Backend Simplification)

**Files:**
- Modify: `frontend/src/app/page.tsx:35-37`
- Modify: `frontend/src/app/lib/api.ts:32-46`

**Step 1: Remove token parameter from uploadPDF function**

Update `frontend/src/app/lib/api.ts` function signature and implementation:
```typescript
export async function uploadPDF(
  file: File
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(UPLOAD_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "File uploaded successfully",
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}
```

**Step 2: Update page.tsx to not pass token**

Update `frontend/src/app/page.tsx` around line 35-40:
```typescript
try {
  const result = await uploadPDF(file);

  if (!result.success) {
    setUploadError(result.error);
    setSelectedFile(null);
  } else {
    setMessages([]);
  }
} catch (error) {
  setUploadError(
    error instanceof Error ? error.message : 'Failed to upload file'
  );
  setSelectedFile(null);
}
```

**Step 3: Remove unused getToken import**

Remove `getToken` from the `useAuth` destructuring in `page.tsx` line 20:
```typescript
const { } = useAuth();
```

Or remove the line entirely if nothing else is used from useAuth.

**Step 4: Commit**

```bash
git add frontend/src/app/lib/api.ts frontend/src/app/page.tsx
git commit -m "refactor: simplify auth by removing token validation requirement"
```

---

## Task 5: Add Health Check Endpoint

**Files:**
- Create: `backend/src/health/healthRoute.js`
- Modify: `backend/src/app.js:4,13`

**Step 1: Create health check route**

Create `backend/src/health/healthRoute.js`:
```javascript
import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
```

**Step 2: Import and use health route in app.js**

Update `backend/src/app.js`:
```javascript
import express from "express";
import cors from "cors";
import uploadRoutes from "./upload/routes/uploadRoute.js";
import chatRoutes from "./chat/routes/chatRoute.js";
import healthRoute from "./health/healthRoute.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoute);
app.use("/rag", uploadRoutes, chatRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
```

**Step 3: Test health endpoint**

Run: `cd backend && npm run dev`
Then: `curl http://localhost:9000/health`
Expected: JSON response with status "ok"

**Step 4: Commit**

```bash
git add backend/src/health/healthRoute.js backend/src/app.js
git commit -m "feat: add health check endpoint for monitoring"
```

---

## Task 6: Add Backend Error Logging

**Files:**
- Modify: `backend/src/upload/controllers/uploadController.js:46`
- Modify: `backend/src/chat/controllers/chatController.js:39`

**Step 1: Improve upload error logging**

Update `backend/src/upload/controllers/uploadController.js` error response:
```javascript
res.status(500).json({
  message: "Error uploading file.",
  error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
});
```

**Step 2: Improve chat error logging and response**

Update `backend/src/chat/controllers/chatController.js`:
```javascript
} catch (error) {
  console.error("Chat error:", error);
  return res.status(500).json({
    message: "Error processing chat request",
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
  });
}
```

**Step 3: Test error handling**

Run backend and trigger an error (e.g., invalid API key)
Expected: Proper error message in response

**Step 4: Commit**

```bash
git add backend/src/upload/controllers/uploadController.js backend/src/chat/controllers/chatController.js
git commit -m "improve: add better error logging and conditional error details"
```

---

## Task 7: Add JSDoc Comments to Controllers

**Files:**
- Modify: `backend/src/upload/controllers/uploadController.js:8`
- Modify: `backend/src/chat/controllers/chatController.js:5`

**Step 1: Add JSDoc to uploadFile function**

Add before `uploadFile` function in `uploadController.js`:
```javascript
/**
 * Handles PDF file upload, text extraction, chunking, and embedding generation
 * @param {import('express').Request} req - Express request with file in req.file
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>} JSON response with upload status and chunk count
 */
const uploadFile = async (req, res) => {
```

**Step 2: Add JSDoc to chatWithDoc function**

Add before `chatWithDoc` function in `chatController.js`:
```javascript
/**
 * Processes chat queries using RAG (Retrieval-Augmented Generation)
 * @param {import('express').Request} req - Express request with question in body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>} JSON response with AI answer and source chunks
 */
export const chatWithDoc = async (req, res) => {
```

**Step 3: Verify no syntax errors**

Run: `cd backend && node --check src/upload/controllers/uploadController.js`
Expected: No errors

**Step 4: Commit**

```bash
git add backend/src/upload/controllers/uploadController.js backend/src/chat/controllers/chatController.js
git commit -m "docs: add JSDoc comments to controller functions"
```

---

## Task 8: Add Loading Progress to Frontend Upload

**Files:**
- Modify: `frontend/src/app/components/pdf/PDFUploader.tsx:145-151`

**Step 1: Enhance upload progress UI**

Update the uploading section in PDFUploader.tsx:
```typescript
{isUploading && (
  <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-5">
    <div className="flex items-center gap-3">
      <Spinner size="sm" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-900">Processing PDF...</p>
        <p className="text-xs text-blue-600 mt-1">
          Extracting text, generating embeddings, and storing in vector database
        </p>
      </div>
    </div>
  </div>
)}
```

**Step 2: Test upload UI**

Run: `cd frontend && npm run dev`
Upload a PDF and observe the improved loading message

**Step 3: Commit**

```bash
git add frontend/src/app/components/pdf/PDFUploader.tsx
git commit -m "improve: enhance upload progress UI with detailed feedback"
```

---

## Task 9: Display Source Scores in Chat

**Files:**
- Modify: `frontend/src/app/components/chat/ChatInterface.tsx`

**Step 1: Read current ChatInterface to understand structure**

Run: Read `frontend/src/app/components/chat/ChatInterface.tsx` to see current message rendering

**Step 2: Add source display with scores**

Update message rendering to show sources with confidence scores (implementation depends on current structure, but add after AI message content):
```typescript
{message.sources && message.sources.length > 0 && (
  <div className="mt-3 pt-3 border-t border-gray-200">
    <p className="text-xs font-semibold text-gray-500 mb-2">Sources:</p>
    <div className="space-y-2">
      {message.sources.map((source, idx) => (
        <div
          key={idx}
          className="text-xs bg-gray-50 rounded-lg p-2 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-700">Chunk {source.chunkIndex}</span>
            <span className="text-blue-600 font-semibold">
              {(source.score * 100).toFixed(1)}% match
            </span>
          </div>
          <p className="text-gray-600 line-clamp-2">{source.text}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

**Step 3: Test chat with sources**

Upload a PDF, ask a question, verify sources display with scores

**Step 4: Commit**

```bash
git add frontend/src/app/components/chat/ChatInterface.tsx
git commit -m "feat: display source chunks with confidence scores"
```

---

## Task 10: Update README with Accurate Information

**Files:**
- Modify: `README.md`

**Step 1: Update README header and description**

Replace `README.md` content with:
```markdown
# RAG-ging

> AI-powered PDF chat application using Retrieval-Augmented Generation (RAG) architecture

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-green)](https://openai.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-orange)](https://www.pinecone.io/)

## Features

🤖 **AI-Powered Chat** - Interact with PDF documents using natural language
🔍 **Semantic Search** - Advanced vector similarity search with OpenAI embeddings
🔐 **Secure Authentication** - Clerk integration for user management
⚡ **Real-time Responses** - Fast RAG pipeline with GPT-4
📊 **Source Attribution** - View relevant chunks with confidence scores
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

```
PDF Upload → Text Extraction → Chunking → OpenAI Embeddings → Pinecone Storage
                                                                      ↓
User Query → OpenAI Embedding → Vector Search → Context Retrieval → GPT-4 Response
```

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
```

**Step 2: Commit README update**

```bash
git add README.md
git commit -m "docs: comprehensive README update with accurate tech stack"
```

---

## Task 11: Add Production CORS Configuration

**Files:**
- Modify: `backend/src/app.js:8`

**Step 1: Update CORS configuration**

Replace line 8 in `backend/src/app.js`:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Step 2: Add FRONTEND_URL to .env.example**

Update `backend/.env.example`:
```env
# Server Configuration
PORT=9000
NODE_ENV=development

# Frontend URL (for CORS in production)
FRONTEND_URL=https://your-frontend.vercel.app

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=rag-documents
```

**Step 3: Test CORS still works locally**

Run: `cd backend && npm run dev`
Test upload from frontend - should work without CORS errors

**Step 4: Commit**

```bash
git add backend/src/app.js backend/.env.example
git commit -m "feat: add production-ready CORS configuration"
```

---

## Task 12: Add File Size Validation

**Files:**
- Modify: `backend/src/config/multerStorage.js`
- Modify: `backend/src/upload/routes/uploadRoute.js`

**Step 1: Read current multer config**

Run: Read `backend/src/config/multerStorage.js`

**Step 2: Add file size limit to multer config**

Update multer configuration to add limits:
```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});
```

**Step 3: Add error handler in upload route**

Update `backend/src/upload/routes/uploadRoute.js` to handle multer errors:
```javascript
import express from "express";
import uploadFile from "../controllers/uploadController.js";
import upload from "../../config/multerStorage.js";

const router = express.Router();

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: "File too large. Maximum size is 50MB."
        });
      }
      return res.status(400).json({
        message: err.message || "File upload error"
      });
    }
    next();
  });
}, uploadFile);

export default router;
```

**Step 4: Test with large file**

Expected: Clear error message for files > 50MB

**Step 5: Commit**

```bash
git add backend/src/config/multerStorage.js backend/src/upload/routes/uploadRoute.js
git commit -m "feat: add 50MB file size limit with validation"
```

---

## Task 13: Remove Unused Package.json Script

**Files:**
- Modify: `backend/package.json:9`

**Step 1: Remove dev:worker script**

Since there's no worker implementation, remove the script:
```json
"scripts": {
  "dev": "PORT=9000 node --watch server.js",
  "start": "node server.js"
}
```

**Step 2: Commit**

```bash
git add backend/package.json
git commit -m "chore: remove unused worker script from package.json"
```

---

## Task 14: Add Basic Error Boundary (Frontend)

**Files:**
- Create: `frontend/src/app/components/ErrorBoundary.tsx`
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Create error boundary component**

Create `frontend/src/app/components/ErrorBoundary.tsx`:
```typescript
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 2: Wrap app with error boundary in layout**

Update `frontend/src/app/layout.tsx` to import and use ErrorBoundary:
```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

// ... inside return statement, wrap children:
<ErrorBoundary>
  <ClerkProvider>
    {children}
  </ClerkProvider>
</ErrorBoundary>
```

**Step 3: Test error boundary**

Temporarily throw an error to test the boundary

**Step 4: Commit**

```bash
git add frontend/src/app/components/ErrorBoundary.tsx frontend/src/app/layout.tsx
git commit -m "feat: add error boundary for graceful error handling"
```

---

## Task 15: Final Testing and Verification

**Files:**
- None (testing only)

**Step 1: Test complete upload flow**

Run:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Upload a small PDF
4. Ask a question
5. Verify sources display with scores

Expected: Complete flow works end-to-end

**Step 2: Test error scenarios**

1. Try uploading non-PDF file
2. Try uploading file > 50MB (if available)
3. Test with invalid/missing API keys

Expected: User-friendly error messages

**Step 3: Verify health endpoint**

Run: `curl http://localhost:9000/health`
Expected: `{"status":"ok",...}`

**Step 4: Check git status**

Run: `git status`
Expected: Working tree clean, all changes committed

**Step 5: Document any issues found**

Create issues or notes for any bugs discovered

---

## Task 16: Create Deployment Checklist Document

**Files:**
- Create: `docs/DEPLOYMENT.md`

**Step 1: Create deployment guide**

Create `docs/DEPLOYMENT.md`:
```markdown
# Deployment Checklist

## Pre-Deployment

- [ ] All tests pass locally
- [ ] Environment variables documented in .env.example
- [ ] README is up to date
- [ ] Code is committed and pushed to GitHub

## Pinecone Setup

- [ ] Create Pinecone account
- [ ] Create index: `rag-documents`
  - Dimensions: 1536
  - Metric: cosine
- [ ] Copy API key and index name

## Backend Deployment (Railway/Render)

### Railway
1. [ ] Go to [railway.app](https://railway.app)
2. [ ] Click "New Project" → "Deploy from GitHub repo"
3. [ ] Select RAG-ging repository
4. [ ] Configure:
   - Root directory: `/backend`
   - Start command: `node server.js`
5. [ ] Add environment variables:
   ```
   PORT=9000
   NODE_ENV=production
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=rag-documents
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. [ ] Deploy
7. [ ] Copy deployment URL (e.g., `rag-backend.up.railway.app`)

## Frontend Deployment (Vercel)

1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Click "Import Project" → Select RAG-ging repo
3. [ ] Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
4. [ ] Add environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_BACKEND_URL=https://rag-backend.up.railway.app
   ```
5. [ ] Deploy
6. [ ] Copy deployment URL

## Post-Deployment

- [ ] Update Railway `FRONTEND_URL` with Vercel URL
- [ ] Test upload functionality on production
- [ ] Test chat functionality on production
- [ ] Verify health check: `https://your-backend.railway.app/health`
- [ ] Update README with live demo link

## Troubleshooting

**Backend not responding:**
- Check Railway logs
- Verify environment variables are set
- Check Pinecone API key is valid

**CORS errors:**
- Ensure `FRONTEND_URL` matches exact Vercel URL
- Check Railway environment variable is set correctly

**Upload fails:**
- Verify OpenAI API key has credits
- Check Pinecone index name matches
- Review backend logs for errors

**Chat returns no results:**
- Ensure PDF was uploaded successfully
- Check Pinecone index has vectors
- Verify OpenAI API is working
```

**Step 2: Commit deployment guide**

```bash
git add docs/DEPLOYMENT.md
git commit -m "docs: add comprehensive deployment checklist"
```

---

## Success Criteria

**Functional Requirements:**
- ✅ Backend runs on port 9000
- ✅ Environment variables properly configured
- ✅ Upload flow works end-to-end
- ✅ Chat returns answers with sources
- ✅ Error handling is user-friendly
- ✅ Health check endpoint responds

**Code Quality:**
- ✅ JSDoc comments on key functions
- ✅ Consistent error handling
- ✅ No unused code/scripts
- ✅ Proper file validation

**Documentation:**
- ✅ README accurately reflects tech stack
- ✅ Clear setup instructions
- ✅ Deployment guide created
- ✅ Environment templates provided

**Production Ready:**
- ✅ CORS configured for production
- ✅ File size limits enforced
- ✅ Error boundary in place
- ✅ Health monitoring endpoint

## Notes

- Each task should take 5-15 minutes
- Test after each major change
- Commit frequently with clear messages
- Focus on working code over perfection
- Documentation is as important as code
