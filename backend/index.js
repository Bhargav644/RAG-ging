// server/index.js
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { Queue } from "bullmq";
import { getVectorStore } from "./utils/vector-store.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const queue = new Queue("Upload-File-Queue", {
  connection: { host: "localhost", port: 6379 },
});

const app = express();
app.use(cors());
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage });

// Routes
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log({ here: req.file });
  await queue.add(
    "Upload-File",
    JSON.stringify({
      filename: req.file.originalname,
      filepath: req.file.path,
      destination: req.file.destination,
    })
  );
  return res.json({ message: "File uploaded successfully" });
});

app.get("/chat", async (req, res) => {
  const { query } = req.query;
  const vectorStore = await getVectorStore("uploaded-documents");
  const retriever = vectorStore.asRetriever({ k: 3 });

  const result = await retriever.invoke(query);

  const PROMPT = `You are a helpful assistant. 
Answer the question based on the context provided from the uploaded document. 
If the answer is not in the context, say "I don't know".
Context: ${JSON.stringify(result)}`;

  const chatResult = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: query },
    ],
  });

  return res.json({
    answer: chatResult?.choices?.[0]?.message?.content,
    docs: result,
  });
});

app.listen(8000, () =>
  console.log("🚀 Server running at http://localhost:8000")
);
