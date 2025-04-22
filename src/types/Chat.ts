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
  created_at?: string;
};
