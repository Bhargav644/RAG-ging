import React from 'react';
import { ChatMessageProps } from '@/app/types';

export default function ChatMessage({ message }: ChatMessageProps) {
  const { sender, content, sources } = message;

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${sender === 'user' ? 'text-right' : 'text-left'}`}>
        <div
          className={`px-5 py-3 ${
            sender === 'user'
              ? 'bg-black text-white rounded-3xl rounded-br-md shadow-md'
              : 'bg-white text-black border-2 border-gray-200 rounded-3xl rounded-bl-md shadow-sm'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Sources:</p>
            <div className="space-y-2">
              {sources.map((source, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-gray-50 rounded-lg p-2 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">Chunk {source.chunkIndex}</span>
                    <span className="text-blue-600 font-semibold">
                      {(source.score * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{source.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}