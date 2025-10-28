'use client';

import React, { useState, KeyboardEvent } from 'react';
import { ChatInputProps } from '@/app/types';
import { Button } from '@/app/components/ui';

export default function ChatInput({
  onSendMessage,
  disabled,
  placeholder = 'Ask a question...',
}: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || disabled) return;

    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:bg-gray-100 disabled:text-gray-400 shadow-sm"
      />
      <Button
        type="submit"
        disabled={disabled || !inputMessage.trim()}
        variant="primary"
        size="md"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </Button>
    </form>
  );
}