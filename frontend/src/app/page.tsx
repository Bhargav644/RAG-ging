'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';

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
  const { getToken } = useAuth();

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
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const result = await uploadPDF(file, token);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header />

      <SignedOut>
        <WelcomeScreen />
      </SignedOut>

      <SignedIn>
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-220px)] min-h-[600px]">
              <PDFUploader
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                uploadError={uploadError}
              />

              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                disabled={!selectedFile || isUploading}
              />
            </div>
          </div>
        </main>
      </SignedIn>

      <Footer />
    </div>
  );
}
