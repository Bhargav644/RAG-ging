'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WelcomeScreen from './components/landing/WelcomeScreen';
import PDFUploader from './components/pdf/PDFUploader';
import ChatInterface from './components/chat/ChatInterface';
import { uploadPDF, sendChatMessage } from './lib/api';
import type { Message } from './types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setMessages([]);
      setUploadError(undefined);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadError(undefined);

    try {
      const result = await uploadPDF(file);

      if (!result.success) {
        setUploadError(result.error);
        setSelectedFile(null);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedFile) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage(content);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content:
          'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <SignedOut>
        <div className="flex-1 flex flex-col pt-20">
          <WelcomeScreen />
        </div>
      </SignedOut>

      <SignedIn>
        {/* Main Content Area - Separated from Header/Footer */}
        <main className="flex-1 flex flex-col pt-24 pb-10 w-full relative z-0">
          <div className="flex-1 max-w-[1700px] w-full mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[700px]">
              {/* Left Panel: Upload - Takes 4 columns */}
              <div className="lg:col-span-4 flex flex-col h-full animate-slide-in-left">
                 <PDFUploader
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  uploadError={uploadError}
                />
              </div>

              {/* Right Panel: Chat - Takes 8 columns */}
              <div className="lg:col-span-8 flex flex-col h-full animate-slide-in-right delay-100">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  disabled={!selectedFile || isUploading}
                />
              </div>
            </div>
          </div>
        </main>
      </SignedIn>

      <Footer />
    </div>
  );
}
