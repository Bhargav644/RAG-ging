"use client";

import { SignInButton } from "@clerk/nextjs";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="w-24 h-24 bg-indigo-600 rounded-full mb-6 flex items-center justify-center">
        <div className="text-white text-4xl">📄</div>
      </div>
      <h2 className="text-3xl font-bold text-center mb-6">Analyze PDFs with AI</h2>
      <p className="text-lg text-gray-600 text-center max-w-md mb-8">
        Sign in to upload your PDFs and chat with our AI about the content.
      </p>
      <div className="flex space-x-4">
        <SignInButton>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-lg">
            Sign In to Get Started
          </button>
        </SignInButton>
      </div>
    </div>
  );
}