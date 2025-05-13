import { supabase } from "../utils/supabase";
import type { Document } from "../types/Document";
import type { LinkDocument } from "../types/Document";

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
    clause: doc.clause,
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

export const getDocument = async (
  type: string,
  number: string,
  year: string
): Promise<LinkDocument> => {
  const { data, error } = await supabase
    .from("link_documents")
    .select("*")
    .eq("type", type)
    .eq("number", number)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error("Error fetching document:", error);
    return undefined as unknown as LinkDocument;
  }

  return data;
};
