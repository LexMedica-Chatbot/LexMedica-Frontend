import { api } from "../utils/api";
import type { Document } from "../types/Document";
import type { LinkDocument } from "../types/Document";

export const createChatMessageDocuments = async (
  messageId: number,
  documents: Document[]
): Promise<void> => {
  const validDocuments = documents.filter((doc) => doc.document_id);

  const inserts = validDocuments.map((doc) => ({
    message_id: messageId,
    document_id: doc.document_id!,
    clause: doc.clause,
    snippet: doc.snippet,
    page_number: doc.page_number
  }));

  if (inserts.length === 0) {
    console.log("No valid documents to be inserted");
    return;
  }

  await api.post("/api/chat/document", inserts);
};

export const getDocument = async (
  type: string,
  number: string,
  year: string
): Promise<LinkDocument> => {
  try {
    const data = await api.get(`/api/document/${type}/${number}/${year}`);
    return data[0];
  } catch (err) {
    console.error(err);
    return {} as LinkDocument;
  }
};
