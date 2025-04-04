import httpClient from "./httpClient";

interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  started_at: string;
}

interface ChatMessage {
  id: number;
  session_id: number;
  sender: "user" | "bot";
  message: string;
  created_at: string;
}

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
 */
export const getChatSessions = async (
  userId: number
): Promise<ChatSession[]> => {
  const response = await httpClient.get<ChatSession[]>(
    "/history/session?user_id=" + userId
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
    "/history/message?session_id=" + sessionId
  );
  return response.data;
};
