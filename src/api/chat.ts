// Desc: Chat API functions for managing chat sessions and messages
import httpClient from "./httpClient";

// ** Types Import
import { ChatSession, ChatMessage } from "../types/Chat";

/**
 * Create a new chat session.
 * @param userId The user ID.
 * @param title The title of the chat session.
 */
export const createChatSession = async (
  userId: number,
  title: string
): Promise<ChatSession> => {
  const response = await httpClient.post<ChatSession>("/history/session", {
    user_id: userId,
    title,
  });
  return response.data;
};

/**
 * Fetch chat history (sessions) for the logged-in user.
 * @param userId The user ID.
 */
export const getChatSessions = async (
  userId: number
): Promise<ChatSession[]> => {
  const response = await httpClient.get<ChatSession[]>(
    `/history/session/${userId}`
  );
  return response.data;
};

/**
 * Delete a specific chat session by its ID.
 * @param sessionId The chat session ID.
 */
export const deleteChatSession = async (
  sessionId: number
): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(
    `/history/session/${sessionId}`
  );
  return response.data;
};

/**
 * Send a new message to a chat session.
 * @param sessionId The chat session ID.
 * @param sender The sender type ("user" or "bot").
 * @param message The message text.
 */
export const createChatMessage = async (
  sessionId: number,
  sender: "user" | "bot",
  message: string
): Promise<ChatMessage> => {
  const response = await httpClient.post<ChatMessage>(`/history/message`, {
    session_id: sessionId,
    sender,
    message,
  });
  return response.data;
};

/**
 * Fetch messages of a specific chat session.
 * @param sessionId The ID of the chat session.
 */
export const getChatMessages = async (
  sessionId: number
): Promise<ChatMessage[]> => {
  const response = await httpClient.get<ChatMessage[]>(
    `/history/message/${sessionId}`
  );
  return response.data;
};

/**
 * Stream the chat completion response from the server.
 * @param question The user's question.
 * @param onChunk Callback function to handle each chunk of data.
 * @param onComplete Callback function to handle completion of the stream.
 * @param onError Callback function to handle errors.
 * @param signal The AbortSignal to cancel the request if needed.
 */
export const streamChatCompletion = async (
  question: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (err: any) => void,
  signal: AbortSignal
) => {
  try {
    const response = await fetch(
      `${
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
      }/chat/qna`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
        signal,
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to streaming endpoint");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }

    onComplete();
  } catch (err) {
    if ((err as any).name === "AbortError") {
      console.log("Fetch aborted by user");
    } else {
      console.error("Streaming error:", err);
      onError(err);
    }
  }
};
