'use client';

import React, { useRef } from 'react';
import { PDFUploaderProps } from '@/app/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';
import { Button } from '@/app/components/ui';
import { Spinner } from '@/app/components/ui';

export default function PDFUploader({
  selectedFile,
  onFileSelect,
  isUploading,
  uploadError,
}: PDFUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card variant="elevated" className="h-full">
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <p className="text-sm text-gray-500 mt-2">Upload a PDF to start chatting</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {!selectedFile ? (
            <div
              onClick={handleButtonClick}
              className="border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all cursor-pointer p-16 text-center rounded-2xl group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-gray-400 group-hover:text-black transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF files only • Max 50MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-gray-200 rounded-2xl p-5 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {isUploading ? (
                  <Spinner size="sm" />
                ) : (
                  <button
                    onClick={handleRemoveFile}
                    className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 hover:border-black hover:bg-gray-100 transition-all flex items-center justify-center"
                    aria-label="Remove file"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {uploadError && (
            <div className="border-2 border-red-500 bg-red-50 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600">{uploadError}</p>
            </div>
          )}

          {isUploading && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <p className="text-sm font-medium text-gray-600">Processing PDF...</p>
              </div>
            </div>
          )}

          {selectedFile && !isUploading && (
            <Button
              variant="ghost"
              onClick={handleButtonClick}
              className="w-full"
            >
              Change File
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
