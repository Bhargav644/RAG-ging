'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatInterfaceProps } from '@/app/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  disabled,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card variant="default" className="h-full flex flex-col bg-white border-[2px] border-black brutalist-shadow-sm">
      <CardHeader>
        <CardTitle className="text-black font-syne">Neural Interface</CardTitle>
        <p className="text-sm text-gray-500 mt-1 font-space">Ask questions about your PDF</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto mb-5 bg-gray-50 rounded-none p-6 border-[2px] border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border-[2px] border-black px-5 py-4 max-w-[80%] flex items-center gap-2 brutalist-shadow-sm">
                    <span className="text-sm text-black font-bold font-syne uppercase">Processing</span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
              <div className="w-20 h-20 bg-white border-[2px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <svg
                  className="w-10 h-10 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2 uppercase font-syne">
                {disabled ? 'System Idle' : 'System Ready'}
              </h3>
              <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto leading-relaxed font-space">
                {disabled
                  ? 'Awaiting Source Material...'
                  : 'Awaiting User Input...'}
              </p>
            </div>
          )}
        </div>

        <ChatInput
          onSendMessage={onSendMessage}
          disabled={disabled || isLoading}
          placeholder={disabled ? 'Upload a PDF first...' : 'Query the system...'}
        />
      </CardContent>
    </Card>
  );
}