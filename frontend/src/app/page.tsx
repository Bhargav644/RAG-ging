"use client";

import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WelcomeScreen from "./components/landing/WelcomeScreen";
import PDFUploader from "./components/pdf/PDFUploader";
import ChatInterface from "./components/chat/ChatInterface";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleFileSelect = async (file: any) => {
    setSelectedFile(file);

    if (file) {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", file);
      await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      setIsProcessing(false);
    } else {
      // Reset the chat when file is removed
      setMessages([]);
    }
  };

  const handleSendMessage = async (message: any) => {
    if (!message.trim() || !selectedFile) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", content: message }];
    setMessages(newMessages as any);
    setChatLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/chat?query=${encodeURIComponent(message)}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          sender: "ai",
          content: data.message,
          // Optional: Include source documents if you want to display them
          sourceDocs: data.docs,
        },
      ] as any);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ] as any);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <SignedOut>
        <WelcomeScreen />
      </SignedOut>

      <SignedIn>
        <main className="container mx-auto p-4 max-w-6xl flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <PDFUploader
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
            />

            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              selectedFile={selectedFile}
              isProcessing={isProcessing}
            />
          </div>
        </main>
      </SignedIn>

      <Footer />
    </div>
  );
}
