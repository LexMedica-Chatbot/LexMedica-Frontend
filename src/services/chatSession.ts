import { supabase } from "../utils/supabase";
import { ChatSession} from "../types/Chat";

export const createChatSession = async (
  userId: string,
  title: string
): Promise<number | null> => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ user_id: userId, title }])
    .select("id") // Just return the ID
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data?.id ?? null;
};

export const getChatSessions = async (
  userId: string
): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

export const deleteChatSession = async (
  sessionId: number
): Promise<{ message: string }> => {
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    console.error(error);
    return { message: "Failed to delete chat session" };
  }

  return { message: "Chat session deleted successfully" };
};
