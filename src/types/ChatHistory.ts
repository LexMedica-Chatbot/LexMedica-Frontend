import { Message } from "./Message";

export type ChatHistory = {
  id?: number;
  title: string;
  messages: Message[];
};
