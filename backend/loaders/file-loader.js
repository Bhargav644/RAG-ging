// loaders/fileLoader.js
import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { JSONLoader } from "langchain/document_loaders/fs/json";


export async function loadFile(fullPath) {
  const ext = path.extname(fullPath).toLowerCase();

  let loader;
  switch (ext) {
    case ".pdf":
      loader = new PDFLoader(fullPath);
      break;
    case ".txt":
      loader = new TextLoader(fullPath);
      break;
    case ".docx":
      loader = new DocxLoader(fullPath);
      break;
    case ".csv":
      loader = new CSVLoader(fullPath);
      break;
    case ".json":
      loader = new JSONLoader(fullPath);
      break;
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }

  return await loader.load();
}
