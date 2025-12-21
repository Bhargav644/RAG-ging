/**
 * API Service Layer
 * Handles all communication with the RAG backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";
const UPLOAD_API_URL = `${API_BASE_URL}/rag/upload`;
const CHAT_API_URL = `${API_BASE_URL}/rag/chat`;

export interface ChatSource {
  chunkIndex: number;
  score: number;
  text: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Upload a PDF file to the RAG system
 * @param file - PDF file to upload
 * @param authToken - Bearer token from Clerk authentication
 * @returns Upload response
 */
export async function uploadPDF(
  file: File,
  authToken: string
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(UPLOAD_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "File uploaded successfully",
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

/**
 * Send a chat message to query the uploaded PDFs
 * @param question - Question to ask about the PDFs
 * @returns Chat response with answer and sources
 */
export async function sendChatMessage(question: string): Promise<ChatResponse> {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      answer: data.answer,
      sources: data.sources || [],
    };
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}
