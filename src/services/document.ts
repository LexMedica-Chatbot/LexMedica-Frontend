import { supabase } from "../utils/supabase";
import type { Document } from "../types/Document";

export const createChatMessageDocuments = async (
  messageId: number,
  documents: Document[]
): Promise<void> => {
  const validDocuments = documents.filter((doc) => {
    if (!doc.document_id || doc.document_id === 0) {
      console.error("Skipping document with invalid ID:", doc);
      return false;
    }
    return true;
  });

  const inserts = validDocuments.map((doc) => ({
    message_id: messageId,
    document_id: doc.document_id!,
    snippet: doc.snippet,
  }));

  if (inserts.length === 0) {
    console.warn("No valid documents to insert.");
    return;
  }

  const { error } = await supabase
    .from("chat_message_documents")
    .insert(inserts);

  if (error) {
    console.error("Error inserting chat_message_documents:", error);
    throw error;
  }
};

export const getDocumentIDUrl = async (
  number: string,
  year: string
): Promise<{ id: number; url: string } | null> => {
  const { data, error } = await supabase
    .from("link_documents")
    .select("id, url")
    .eq("number", number)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  return data ? { id: data.id, url: data.url } : null;
};
