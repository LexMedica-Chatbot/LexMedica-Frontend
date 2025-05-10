import { supabase } from "../utils/supabase";

export const createDisharmonyResult = async (
  messageId: number,
  result: string
): Promise<void> => {
  const { error } = await supabase
    .from("disharmony_analysis")
    .insert([{ message_id: messageId, result }]);

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
        process.env.REACT_APP_DISHARMONY_URL || "http://localhost:8080"
      }/api/chat/analyze`,
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
