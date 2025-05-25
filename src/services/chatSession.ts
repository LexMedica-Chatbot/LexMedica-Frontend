import { api } from "../utils/api";
import { ChatSession } from "../types/Chat";

export const createChatSession = async (
  userId: string,
  title: string
): Promise<number | null> => {
  try {
    const res = await api.post("/api/chat/session", { user_id: userId, title });
    return res.id ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getChatSessions = async (
  userId: string
): Promise<ChatSession[]> => {
  try {
    return await api.get(`/api/chat/session/${userId}`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const deleteChatSession = async (
  sessionId: number
): Promise<{ message: string }> => {
  try {
    return await api.delete(`/api/chat/session/${sessionId}`);
  } catch (err) {
    console.error(err);
    return { message: "Failed to delete chat session" };
  }
};
