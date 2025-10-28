'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import LoginButtons from '../auth/LoginButtons';
import UserProfileButton from '../auth/UserProfileButton';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
            <svg
              className="w-5 h-5 text-white"
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
          <div>
            <h1 className="text-xl font-bold text-black tracking-tight">RAG PDF Chat</h1>
            <p className="text-xs text-gray-500">AI-Powered Document Analysis</p>
          </div>
        </div>

        <div>
          <SignedOut>
            <LoginButtons />
          </SignedOut>
          <SignedIn>
            <UserProfileButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}