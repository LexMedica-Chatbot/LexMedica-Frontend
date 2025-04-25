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
  disharmony_result?: ChatDisharmony;
  created_at?: string;
};

export type ChatDisharmony = {
  id?: number;
  message_id?: number;
  analysis: string;
  created_at?: string;
};
