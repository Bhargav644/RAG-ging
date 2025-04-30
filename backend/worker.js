import { Worker } from "bullmq";
import path from 'path';
import fs from 'fs';
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: path.join(__dirname, '.env') });

const worker = new Worker(
  "Upload-PDF-Queue",
  async (job) => {
    try {
      
      const data = JSON.parse(job?.data);
      console.log({data})
      const { filepath, filename, metadata = {} } = data;
      console.log(`Processing job ${filename}`);

      const fullPath = path.join(process.cwd(), filepath);
      console.log(`Reading PDF from: ${fullPath}`);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found at path: ${filepath}`);
      }

      const loader = new PDFLoader(fullPath);
      const docs = await loader.load();
      console.log(`Loaded ${docs.length} pages from PDF`);

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });


      const chunks = await textSplitter.splitDocuments(docs);
      console.log(`Created ${chunks.length} chunks from the PDF`,chunks);

      const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      });


      const vectorStore = new QdrantVectorStore(embeddings, {
        
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: "uploaded-pdf-documents",
      });

      const enhancedChunks = chunks.map((chunk, i) => {
        return new Document({
          pageContent: chunk.pageContent,
          metadata: {
            ...chunk.metadata,
            filename,
            chunkIndex: i,
            documentId: data?.documentId || `doc-${Date.now()}`,
            ...metadata
          }
        });
      });


      await vectorStore.addDocuments(enhancedChunks);
      console.log(`Successfully stored ${enhancedChunks.length} chunks in Qdrant`);
      
      return { success: true, chunks: enhancedChunks.length };

    } catch (error) {
      console.error("Error processing PDF:", error);
      throw error;
    }
  },
  { concurrency: 100, connection: { host: "localhost", port: 6379 } }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

process.on("SIGINT", async () => {
  await worker.close();
  console.log("Worker shutdown completed");
  process.exit(0);
});
