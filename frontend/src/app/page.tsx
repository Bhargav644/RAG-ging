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
  
  const handleFileSelect = async (file:any) => {
    setSelectedFile(file);
    
    if (file) {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("pdf", file);
      await fetch("http://localhost:8000/upload",{
        method:"POST",
        body: formData,
      })

      setIsProcessing(false)
      
      // Simulate PDF processing - replace with actual API call
      // setTimeout(() => {
      //   setIsProcessing(false);
      //   setMessages([
      //     { 
      //       sender: "ai", 
      //       content: `I've analyzed "${file.name}". What would you like to know about it?`
      //     }
      //   ]);
      // }, 2000);
    } else {
      // Reset the chat when file is removed
      setMessages([]);
    }
  };
  
  const handleSendMessage = (message) => {
    if (!message.trim() || !selectedFile) return;
    
    // Add user message
    const newMessages = [
      ...messages,
      { sender: "user", content: message }
    ];
    setMessages(newMessages);
    
    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          sender: "ai", 
          content: `This is a simulated response about the PDF "${selectedFile.name}". In a real implementation, this would be the AI's response about your query: "${message}"`
        }
      ]);
    }, 1000);
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