import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const queue = new Queue("Upload-PDF-Queue", {
  connection: { host: "localhost", port: 6379 },
});

const app = express();
app.use(cors());
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

// storage of files and upload code below

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  await queue.add(
    "Upload-PDF",
    JSON.stringify({
      filename: req.file.originalname,
      filepath: req.file.path,
      destination: req.file.destination,
    })
  );
  return res.json({ message: "File Uploaded Successfully" });
});

app.get("/chat", async (req, res) => {
  const { query } = req.query;

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = new QdrantVectorStore(embeddings, {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collectionName: "uploaded-pdf-documents",
  });

  const retriever = vectorStore.asRetriever({ k: 2 });
  const result = await retriever.invoke(query);

  const PROMPT = `You are a helpful assistant. 
    Answer the question based on the context provided from PDF file. If the answer is not in the context, say 'I don't know'
    Context: ${JSON.stringify(result)}`;

  const chatResult = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: PROMPT,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });

  return res.json({ message:chatResult?.choices?.[0]?.message?.content ,docs:result});
});

app.listen(8000, () => console.log("Server Started on Port 8000"));
