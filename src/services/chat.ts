import { supabase } from "../utils/supabase";
import { ChatSession, ChatMessage } from "../types/Chat";

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
    .eq("id", sessionId); // Specify the chat session to delete

  if (error) {
    console.error(error);
    return { message: "Failed to delete chat session" };
  }

  return { message: "Chat session deleted successfully" };
};

export const createChatMessage = async (
  sessionId: number,
  sender: "user" | "bot",
  message: string
): Promise<ChatMessage | null> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([{ session_id: sessionId, sender, message }])
    .single(); // Insert a single message

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export const getChatMessages = async (
  sessionId: number
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId); // Fetch messages for the specific session

  if (error) {
    console.error(error);
    return [];
  }

  return data;
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
