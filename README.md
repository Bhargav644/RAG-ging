
# RAG-ging

RAG-ging is a project built on the Retrieval-Augmented Generation (RAG) architecture that enables users to chat with PDFs. It leverages the power of OpenAI, Qdrant as a vector database, and integrates a robust queuing mechanism using BullMQ, with Velkey as the Redis-compatible backend.



## Getting Started

####  1. Clone the repository:

```bash
  git clone https://github.com/Bhargav644/RAG-ging.git
  cd RAG-ging
```

#### 2. Start the Frontend:

```bash
  cd frontend
  yarn install          # or npm install
  yarn dev    
```
The frontend will be running at http://localhost:3000


#### 3. Start Required Services with Docker (try install docker desktop)

```bash
  colima start                     # if using Colima
  docker compose down             # stop any existing containers
  docker compose up -d            # start Qdrant and Velkey containers in detached mode
  
```


#### 4. Configure Environment Variables:

```env

OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333 # Optional – defaults to this value

```

#### 5. Start the Backend:

```bash
  cd backend
  yarn install
  yarn dev            # Starts the API server on port 8000
  yarn dev:worker     # Starts the BullMQ worker process
    
```

* Backend API will run at http://localhost:8000
* Qdrant (Vector DB) will be available at http://localhost:6333
* Velkey (Redis-compatible store) will run on port 6379
