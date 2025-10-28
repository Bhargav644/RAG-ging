/**
 * Type definitions for the RAG Chat application
 */

export interface ChatSource {
  chunkIndex: number;
  score: number;
  text: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  sources?: ChatSource[];
  timestamp: Date;
}

export interface PDFUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  isUploading: boolean;
  uploadError?: string;
}

export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export interface ChatMessageProps {
  message: Message;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}
