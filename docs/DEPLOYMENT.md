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
