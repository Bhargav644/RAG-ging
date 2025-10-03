"use client";

import { useRef } from "react";
import ProcessingIndicator from "./ProcessingIndicator";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "📄 PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "📝 DOCX",
  "text/plain": "📃 TXT",
  "text/csv": "📊 CSV",
  "application/json": "🔍 JSON",
};

export default function FileUploader({
  selectedFile,
  onFileSelect,
  isProcessing,
}: any) {
  const fileInputRef = useRef<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && Object.keys(ALLOWED_TYPES).includes(file.type)) {
      onFileSelect(file);
    } else {
      alert(
        "Unsupported file type. Please upload PDF, DOCX, TXT, CSV, or JSON."
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Your File
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept={Object.keys(ALLOWED_TYPES).join(",")}
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition"
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">
                {ALLOWED_TYPES[selectedFile.type]?.split(" ")[0] || "📦"}
              </div>
              <p className="font-medium text-indigo-700">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect(null);
                }}
              >
                Replace File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-gray-600">Click to select a file</p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOCX, TXT, CSV, JSON
              </p>
            </div>
          )}
        </div>
      </div>

      {isProcessing && <ProcessingIndicator />}

      {selectedFile && !isProcessing && (
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <p className="text-green-700 flex items-center">
            <span className="mr-2">✓</span>
            {ALLOWED_TYPES[selectedFile.type]?.split(" ")[1] || "File"} ready
            for analysis
          </p>
        </div>
      )}
    </div>
  );
}
