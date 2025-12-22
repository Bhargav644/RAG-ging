'use client';

import React, { useState, KeyboardEvent } from 'react';
import { ChatInputProps } from '@/app/types';
import { Button } from '@/app/components/ui';

export default function ChatInput({
  onSendMessage,
  disabled,
  placeholder = 'Query the system...',
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
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-4 bg-white border-[3px] border-black text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all text-sm font-space font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <Button
        type="submit"
        disabled={disabled || !inputMessage.trim()}
        variant="primary"
        size="lg"
        className="h-[58px] px-6 aspect-square flex items-center justify-center shrink-0"
      >
        <svg
          className="w-6 h-6 transform rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={3}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </Button>
    </form>
  );
}