"use client";

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatInterface({ messages, onSendMessage, selectedFile, isProcessing }:any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[600px]">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Chat with AI about your PDF</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-md p-4">
        {selectedFile ? (
          messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg:string, index:number) => (
                <ChatMessage key={index} message={msg} />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Ask a question about your PDF</p>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Upload a PDF to start chatting</p>
          </div>
        )}
      </div>
      
      <ChatInput 
        onSendMessage={onSendMessage}
        disabled={!selectedFile || isProcessing}
      />
    </div>
  );
}