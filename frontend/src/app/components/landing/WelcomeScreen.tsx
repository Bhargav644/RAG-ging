'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/app/components/ui';

export default function WelcomeScreen() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="mb-10">
          <div className="w-24 h-24 mx-auto bg-black rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-black mb-6 tracking-tight leading-tight">
          Chat with Your PDFs
        </h1>

        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
          Upload your documents and get instant answers powered by AI.
        </p>

        <p className="text-base text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
          Extract insights, summarize content, and ask questions about your PDFs
          in natural language.
        </p>

        <div className="flex gap-4 justify-center mb-20">
          <SignUpButton>
            <Button variant="primary" size="lg">
              Get Started Free
            </Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </SignInButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all bg-white">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-5 shadow-md">
              <svg
                className="w-7 h-7 text-white"
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
            <h3 className="text-lg font-bold text-black mb-3">Upload</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Simply drag and drop your PDF files to get started instantly
            </p>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all bg-white">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-5 shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black mb-3">Chat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ask questions and get accurate answers from your documents
            </p>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all bg-white">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-5 shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black mb-3">Instant</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Get responses in seconds with source references included
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}