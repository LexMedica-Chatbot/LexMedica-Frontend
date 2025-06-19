export type Regulation = {
  dokumen: string;
  pasal: string;
  ayat: string;
};

export type Document = {
  message_id?: number;
  document_id?: number;
  clause: string;
  snippet: string;
  source: LinkDocument;
  page_number: number;
};

export type LinkDocument = {
  id?: number;
  title?: string;
  about?: string;
  type?: string;
  number?: string;
  year?: string;
  status?: string;
  url?: string;
};
