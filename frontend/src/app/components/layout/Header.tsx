'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import LoginButtons from '../auth/LoginButtons';
import UserProfileButton from '../auth/UserProfileButton';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 rounded-none bg-midnight-950/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-aurora-purple to-aurora-cyan shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform duration-300">
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
            <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-aurora-purple group-hover:to-aurora-cyan transition-all duration-300">RAG PDF Chat</h1>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">AI-Powered Document Analysis</p>
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