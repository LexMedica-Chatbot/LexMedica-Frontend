import { supabase } from "../utils/supabase";
import { ChatDisharmony } from "../types/Chat";

export const createDisharmonyResult = async (
  messageId: number,
  disharmony: ChatDisharmony
): Promise<void> => {
  const { error } = await supabase.from("disharmony_analysis").insert([
    {
      message_id: messageId,
      analysis: disharmony.analysis,
      result: disharmony.result,
    },
  ]);

  if (error) {
    console.error("Error creating disharmony result:", error);
    throw error;
  }
};

/**
 * Stream the chat completion response from the server.
 * @param regulations The user's regulations.
 * @param onDisharmony Is potential disharmony found.
 * @param onAnalysisChunk Callback function to handle each chunk of data.
 * @param onComplete Callback function to handle completion of the stream.
 * @param onError Callback function to handle errors.
 * @param signal The AbortSignal to cancel the request if needed.
 */
export const streamChatCompletionDisharmonyAnalysis = async (
  regulations: string,
  onDisharmony: (value: boolean) => void,
  onAnalysisChunk: (chunk: string) => void,
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

    let receivedDisharmony = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      console.log("Received chunk:", chunk);

      // Handle the initial JSON line that includes "disharmony"
      if (!receivedDisharmony) {
        try {
          // Extract JSON object from string like: data: {"disharmony": true}
          const match = chunk.match(/data:\s*({.*})/);
          if (match) {
            const parsed = JSON.parse(match[1]);
            if (typeof parsed.disharmony === "boolean") {
              onDisharmony(parsed.disharmony);
              receivedDisharmony = true;
              continue;
            }
          }
        } catch (e) {
          console.warn("Failed to parse disharmony chunk:", e);
        }
      }

      // Everything else is considered part of the analysis
      onAnalysisChunk(chunk);
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

export const fetchDisharmonyAnalysis = async (
  regulations: string,
  onResult: (data: ChatDisharmony) => void,
  onError: (err: any) => void,
  signal: AbortSignal
): Promise<ChatDisharmony | void> => {
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
        body: JSON.stringify({ regulations, method: "zero-shot" }),
        signal, // Attach abort signal here
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const parsed: ChatDisharmony = JSON.parse(cleaned);

      onResult(parsed);

      return parsed;
    } catch (err) {
      throw new Error("Failed to parse JSON from LLM response");
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("Fetch aborted by user");
    } else {
      console.error("Request error:", err);
      onError(err);
    }
  }
};
