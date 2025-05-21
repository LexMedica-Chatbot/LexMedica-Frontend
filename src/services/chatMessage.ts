import { supabase } from "../utils/supabase";
import { ChatMessage } from "../types/Chat";

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
      disharmony_analysis (
        id,
        result,
        analysis
      ),
      chat_message_documents (
        message_id,
        clause,
        document_id,
        snippet,
        link_documents (
          type,
          about,
          number,
          year,
          status,
          url
        )
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