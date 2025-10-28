import fs from "fs";
import path from "path";
import { generateChunks } from "../../utils/chunk-generator.js";
import { generateEmbeddingsWRTFile } from "../../utils/embeddings.js";
import pineConeIndex from "../../config/pinecone.js";
import { PDFParse } from "pdf-parse";

const uploadFile = async (req, res) => {
  let absolutePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    absolutePath = path.resolve(req.file.path);

    // Use file URL for pdf-parse (file:// requires absolute path)
    const fileUrl = `file://${absolutePath}`;
    const parser = new PDFParse({ url: fileUrl });
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
      error: error.message,
    });
  }
};

export default uploadFile;
