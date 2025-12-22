import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ErrorBoundary } from './components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAG PDF Chat - Chat with Your Documents",
  description: "Upload your PDFs and chat with AI to extract insights, get answers, and summarize content in natural language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary>
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
           {children}
          </body>
        </html>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
