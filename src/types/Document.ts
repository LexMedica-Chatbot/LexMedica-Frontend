export type Document = {
  message_id?: number;
  document_id?: number;
  snippet: string;
  source: LinkDocument;
};

export type LinkDocument = {
  id?: number;
  title: string;
  url: string;
};
