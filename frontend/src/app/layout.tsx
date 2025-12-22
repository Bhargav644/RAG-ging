import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorBoundary } from './components/ErrorBoundary';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "RAG PDF Chat - Brutalism",
  description: "Chat with your documents. Stark. Simple. Powerful.",
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
          <body className={`${syne.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col overflow-x-hidden bg-white text-black`}>
           {children}
          </body>
        </html>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
