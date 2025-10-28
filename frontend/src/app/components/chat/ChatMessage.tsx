import React, { useState } from 'react';
import { ChatMessageProps } from '@/app/types';

export default function ChatMessage({ message }: ChatMessageProps) {
  const { sender, content, sources } = message;
  const [showSources, setShowSources] = useState(false);

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
          <div className="mt-3 ml-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs font-medium text-gray-500 hover:text-black transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
            >
              {showSources ? '▼' : '▶'} {sources.length} source{sources.length > 1 ? 's' : ''}
            </button>

            {showSources && (
              <div className="mt-3 space-y-2">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-xl p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        Source {idx + 1}
                      </span>
                      <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        {(source.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{source.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}