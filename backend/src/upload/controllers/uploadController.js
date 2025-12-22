import fs from "fs";
import path from "path";
import { generateChunks } from "../../utils/chunk-generator.js";
import { generateEmbeddingsWRTFile } from "../../utils/embeddings.js";
import pineConeIndex from "../../config/pinecone.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

/**
 * Handles PDF file upload, text extraction, chunking, and embedding generation
 * @param {import('express').Request} req - Express request with file in req.file
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>} JSON response with upload status and chunk count
 */
const uploadFile = async (req, res) => {
  let absolutePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    absolutePath = path.resolve(req.file.path);

    // Read PDF file and parse text using PDFParse class
    const parser = new PDFParse({ data: fs.readFileSync(absolutePath) });
    const result = await parser.getText();
    const text = result.text;

    if (!text || text.length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    const chunks = generateChunks(text);
    const embeddings = await generateEmbeddingsWRTFile(chunks, req.file);

    if (embeddings.length === 0) {
      throw new Error("No embeddings were generated from the PDF");
    }

    await pineConeIndex.upsert(embeddings);

    // Delete file after successful processing
    fs.unlinkSync(absolutePath);

    res.status(200).json({
      message: "File uploaded successfully!",
      file: req.file,
      chunksProcesses: chunks.length,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    // Clean up file on error
    if (absolutePath && fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (unlinkError) {
        console.error("Failed to delete file:", unlinkError);
      }
    }

    res.status(500).json({
      message: "Error uploading file.",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

export default uploadFile;
