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
    <Card variant="default" className="h-full flex flex-col bg-white border-[2px] border-black brutalist-shadow-sm">
      <CardHeader>
        <CardTitle className="text-black font-syne">Source Material</CardTitle>
        <p className="text-sm text-gray-500 mt-1 font-space">Upload PDF needed for analysis</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col gap-5 h-full">
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
              className="flex-1 border-[2px] border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-300 cursor-pointer p-16 text-center group flex items-center justify-center relative overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white border-[2px] border-black flex items-center justify-center group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-black mb-2 font-syne uppercase">
                    Click to Upload
                  </p>
                  <p className="text-sm text-gray-500 font-space font-medium">PDF • Max 50MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-[2px] border-black p-6 bg-gray-50 h-full flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-white border-[2px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <svg
                    className="w-10 h-10 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
              </div>

              <div className="mb-8">
                <p className="text-lg font-bold text-black truncate max-w-[200px] mx-auto font-syne uppercase">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-space font-bold uppercase">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {isUploading ? (
                <div className="w-full max-w-[200px]">
                  <div className="flex items-center justify-between text-xs font-bold text-black uppercase mb-2">
                    <span>Analyzing</span>
                    <span className="animate-pulse">...</span>
                  </div>
                  <div className="h-2 w-full border-[1px] border-black p-[1px]">
                     <div className="h-full bg-black w-full animate-marquee"></div>
                  </div>
                </div>
              ) : (
                <Button
                   variant="secondary"
                   size="md"
                   onClick={handleRemoveFile}
                   className="w-full max-w-[200px]"
                >
                  Change File
                </Button>
              )}
            </div>
          )}

          {uploadError && (
            <div className="border-[2px] border-black bg-red-50 p-4 flex items-center gap-3">
              <span className="font-bold text-red-600">!</span>
              <p className="text-sm font-bold text-red-600 uppercase">{uploadError}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
