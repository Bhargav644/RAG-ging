import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const worker = new Worker(
  "Upload-PDF-Queue",
  async (job) => {
    try {
      console.log(`Processing job ${job.data?.fileName}`);
      const data = JSON.parse(job.data);
      const { filePath, fileName, metadata = {} } = data;

      const fullPath = path.join(process.cwd(), "uploads", filePath);
      console.log(`Reading PDF from: ${fullPath}`);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found at path: ${fullPath}`);
      }

      const loader = new PDFLoader(fullPath);
      const docs = await loader.load();
      console.log(`Loaded ${docs.length} pages from PDF`);

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });


      const chunks = await textSplitter.splitDocuments(docs);
      console.log(`Created ${chunks.length} chunks from the PDF`);

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });


      const vectorStore = new QdrantVectorStore(embeddings, {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: "documents",
      });

      const enhancedChunks = chunks.map((chunk, i) => {
        return new Document({
          pageContent: chunk.pageContent,
          metadata: {
            ...chunk.metadata,
            fileName,
            chunkIndex: i,
            documentId: data.documentId || `doc-${Date.now()}`,
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
