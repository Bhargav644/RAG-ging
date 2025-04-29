"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import LoginButtons from "../auth/LoginButtons";
import UserProfileButton from "../auth/UserProfileButton";

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
        <h1 className="text-xl font-bold text-indigo-800">PDF Analyzer</h1>
      </div>
      
      <div>
        <SignedOut>
          <LoginButtons />
        </SignedOut>
        <SignedIn>
          <UserProfileButton />
        </SignedIn>
      </div>
    </header>
  );
}