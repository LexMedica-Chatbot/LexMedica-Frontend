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
  sender: string,
  message: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([{ session_id: sessionId, sender, message }])
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("Error inserting message:", error);
    throw error;
  }

  return data.id;
};

export const getChatMessages = async (
  sessionId: number
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select(
      `
        id,
        session_id,
        sender,
        message,
        created_at,
        disharmony_results (
            id,
            analysis,
            created_at
        )
      `
    )
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((msg) => ({
    ...msg,
    // Use only the first disharmony result (if any)
    disharmony_result: msg.disharmony_results?.[0] ?? undefined,
  }));
};

/**
 * Stream the chat completion response from the server.
 * @param question The user's question.
 * @param onChunk Callback function to handle each chunk of data.
 * @param onComplete Callback function to handle completion of the stream.
 * @param onError Callback function to handle errors.
 * @param signal The AbortSignal to cancel the request if needed.
 */
export const streamChatCompletionQnaAnswer = async (
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

export const createDisharmonyResult = async (
  messageId: number,
  analysis: string
): Promise<void> => {
  const { error } = await supabase
    .from("disharmony_results")
    .insert([{ message_id: messageId, analysis }]);

  if (error) {
    console.error("Error creating disharmony result:", error);
    throw error;
  }
};

/**
 * Stream the chat completion response from the server.
 * @param regulations The user's regulations.
 * @param onChunk Callback function to handle each chunk of data.
 * @param onComplete Callback function to handle completion of the stream.
 * @param onError Callback function to handle errors.
 * @param signal The AbortSignal to cancel the request if needed.
 */

export const streamChatCompletionDisharmonyAnalysis = async (
  regulations: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (err: any) => void,
  signal: AbortSignal
) => {
  try {
    const response = await fetch(
      `${
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
      }/chat/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regulations,
          method: "zero-shot",
        }),
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
