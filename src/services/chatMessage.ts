import { api } from "../utils/api";
import { ChatMessage } from "../types/Chat";

export const createChatMessage = async (
  sessionId: number,
  sender: string,
  message: string,
  processingTimeMs: number
): Promise<number> => {
  const res = await api.post("/api/chat/message", {
    session_id: sessionId,
    sender,
    message,
    processing_time_ms: processingTimeMs,
  });

  return res.id;
};

export const getChatMessages = async (
  sessionId: number
): Promise<ChatMessage[]> => {
  const res = await api.get(`/api/chat/message/${sessionId}`);

  return res.map((msg: any) => ({
    ...msg,
    disharmony: msg.disharmony_analysis?.[0] ?? undefined,
    documents: (msg.chat_message_documents || []).map((rel: any) => ({
      message_id: rel.message_id,
      document_id: rel.document_id,
      clause: rel.clause,
      snippet: rel.snippet,
      source: {
        id: rel.link_documents.id,
        type: rel.link_documents.type,
        about: rel.link_documents.about,
        number: rel.link_documents.number,
        year: rel.link_documents.year,
        status: rel.link_documents.status,
        url: rel.link_documents.url,
      },
    })),
  }));
};
