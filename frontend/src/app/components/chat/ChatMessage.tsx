import React from 'react';
import { ChatMessageProps, SearchMethod } from '@/app/types';

const getSearchMethodBadge = (foundBy?: SearchMethod) => {
  if (!foundBy) return null;

  const badges = {
    hybrid: { emoji: '🎯', label: 'Hybrid', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    semantic: { emoji: '🔍', label: 'Semantic', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    keyword: { emoji: '📝', label: 'Keyword', color: 'bg-green-100 text-green-700 border-green-300' }
  };

  const badge = badges[foundBy];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
      <span>{badge.emoji}</span>
      {badge.label}
    </span>
  );
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const { sender, content, sources } = message;

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-appear`}>
      <div className={`max-w-[85%] ${sender === 'user' ? 'text-right' : 'text-left'}`}>
        <div
          className={`px-6 py-4 font-space text-sm font-medium leading-relaxed border-[2px] border-black ${
            sender === 'user'
              ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
              : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-4 pl-0">
            <p className="text-xs font-bold font-syne uppercase tracking-wider mb-2 flex items-center gap-2 text-black">
              <span className="w-2 h-2 bg-black"></span>
              Verified Sources
            </p>
            <div className="space-y-3">
              {sources.map((source, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-white border border-gray-300 p-3 hover:border-black transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 group-hover:border-black">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-black">Chunk {source.chunkIndex}</span>
                      {getSearchMethodBadge(source.foundBy)}
                    </div>
                    <span className="font-bold bg-gray-100 text-black px-2 py-0.5 group-hover:bg-black group-hover:text-white border border-gray-200 group-hover:border-black">
                      {(source.score * 100).toFixed(0)}% MATCH
                    </span>
                  </div>

                  {/* Show score breakdown for hybrid results */}
                  {source.foundBy === 'hybrid' && source.vectorScore !== undefined && source.bm25Score !== undefined && (
                    <div className="text-[10px] text-gray-500 mb-2 font-mono">
                      Vector: {(source.vectorScore * 100).toFixed(0)}% | BM25: {source.bm25Score.toFixed(2)}
                    </div>
                  )}

                  {/* Show matched keywords */}
                  {source.matchedTerms && source.matchedTerms.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {source.matchedTerms.map((term, i) => (
                        <span key={i} className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-300 font-mono">
                          {term}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-600 line-clamp-2 italic font-serif group-hover:text-black">"{source.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}