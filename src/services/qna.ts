// /**
//  * Stream the chat completion response from the server.
//  * @param question The user's question.
//  * @param onChunk Callback function to handle each chunk of data.
//  * @param onComplete Callback function to handle completion of the stream.
//  * @param onError Callback function to handle errors.
//  * @param signal The AbortSignal to cancel the request if needed.
//  */
// export const streamChatCompletionQnaAnswer = async (
//   question: string,
//   onChunk: (chunk: string) => void,
//   onComplete: () => void,
//   onError: (err: any) => void,
//   signal: AbortSignal
// ) => {
//   try {
//     const response = await fetch(
//       `${
//         process.env.REACT_APP_QNA_URL || "http://localhost:8080"
//       }/api/chat`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question: question }),
//         signal,
//       }
//     );

//     if (!response.ok || !response.body) {
//       throw new Error("Failed to connect to streaming endpoint");
//     }

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder("utf-8");

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       const chunk = decoder.decode(value, { stream: true });
//       onChunk(chunk);
//     }

//     onComplete();
//   } catch (err) {
//     if ((err as any).name === "AbortError") {
//       console.log("Fetch aborted by user");
//     } else {
//       console.error("Streaming error:", err);
//       onError(err);
//     }
//   }
// };

export const fetchQnaAnswer = async (
  question: string,
  modelUrl: string,
  history: string[],
  onResult: (data: any) => void,
  onError: (err: any) => void,
  signal: AbortSignal
) => {
  try {
    const response = await fetch(
      `${modelUrl || "http://localhost:8080"}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_QNA_API_KEY || "", // Use env variable
        },
        body: JSON.stringify({
          query: question,
          embedding_model: "large",
          previous_responses: history,
        }),
        signal,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from QnA endpoint");
    }

    const data = await response.json();
    if (!data) {
      throw new Error("No data received from QnA endpoint");
    }

    onResult(data);
  } catch (err) {
    if ((err as any).name === "AbortError") {
      console.log("Fetch aborted by user");
    } else {
      console.error("Fetch error:", err);
      onError(err);
    }
  }
};
