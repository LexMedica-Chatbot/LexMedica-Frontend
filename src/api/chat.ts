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
    `/history/session/${userId}`
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

export const streamChatCompletion = async (
  question: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (err: any) => void
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
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to streaming endpoint");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      buffer += chunk;

      // Break into SSE chunks
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || ""; // hold last partial line

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();

          if (data === "[DONE]") {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.message?.content || "";
            onChunk(content);
          } catch (e) {
            onChunk(data);
          }
        } else {
          console.warn("Unexpected non-data line:", line);
        }
      }
    }

    onComplete();
  } catch (err) {
    console.error("Streaming error:", err);
    onError(err);
  }
};
