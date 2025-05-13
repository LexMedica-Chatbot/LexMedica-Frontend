export type Document = {
  message_id?: number;
  document_id?: number;
  clause: string;
  snippet: string;
  source: LinkDocument;
};

export type LinkDocument = {
  id?: number;
  title?: string;
  about?: string;
  type: string;
  number?: string;
  year?: string;
  status?: string;
  url: string;
};
