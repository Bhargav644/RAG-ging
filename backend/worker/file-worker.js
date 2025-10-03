// workers/fileWorker.js
import { Worker } from "bullmq";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { loadFile } from "../loaders/file-loader.js";
import { splitIntoChunks } from "../utils/text-splitter.js";
import { getVectorStore } from "../utils/vector-store.js";
import { Document } from "@langchain/core/documents";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const worker = new Worker(
  "Upload-File-Queue",
  async (job) => {
    try {
      const { filepath, filename, metadata = {}, documentId } = JSON.parse(job?.data);
      const fullPath = path.join(process.cwd(), filepath);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
      }

      console.log(`Processing: ${filename}`);

      // Step 1: Load file
      const docs = await loadFile(fullPath);

      // Step 2: Split into chunks (sliding window)
      const chunks = await splitIntoChunks(docs);

      // Step 3: Init vector store
      const vectorStore = await getVectorStore("uploaded-documents");

      // Step 4: Enhance + add docs
      const enhancedChunks = chunks.map((chunk, i) =>
        new Document({
          pageContent: chunk.pageContent,
          metadata: {
            ...chunk.metadata,
            filename,
            chunkIndex: i,
            documentId: documentId || `doc-${Date.now()}`,
            ...metadata,
          },
        })
      );

      await vectorStore.addDocuments(enhancedChunks);

      console.log(`Stored ${enhancedChunks.length} chunks in Qdrant`);
      return { success: true, chunks: enhancedChunks.length };
    } catch (error) {
      console.error("Worker Error:", error);
      throw error;
    }
  },
  { concurrency: 5, connection: { host: "localhost", port: 6379 } }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed ✅`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} ❌ ${err.message}`));
