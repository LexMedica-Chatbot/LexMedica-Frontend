import { Document } from "./Document";

export type ChatSession = {
  id: number;
  user_id: number;
  title: string;
  started_at: string;
};

export type ChatMessage = {
  id?: number;
  session_id?: number;
  sender: "user" | "bot";
  message: string;
  disharmony?: ChatDisharmony;
  documents?: Document[];
  created_at?: string;
};

export type ChatDisharmony = {
  id?: number;
  message_id?: number;
  result: boolean;
  analysis: string;
  created_at?: string;
};
