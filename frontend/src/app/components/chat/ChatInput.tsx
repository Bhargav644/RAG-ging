"use client";

import { useState } from "react";

export default function ChatInput({ onSendMessage, disabled }:any) {
  const [inputMessage, setInputMessage] = useState("");
  
  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (!inputMessage.trim() || disabled) return;
    
    onSendMessage(inputMessage);
    setInputMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ask something about your PDF..."
        disabled={disabled}
        className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <button
        type="submit"
        disabled={disabled || !inputMessage.trim()}
        className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-300 transition"
      >
        Send
      </button>
    </form>
  );
}