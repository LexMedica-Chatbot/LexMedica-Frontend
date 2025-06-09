// utils/api.ts
import { supabase } from "./supabase";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeader = async (): Promise<HeadersInit> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  return {};
};

export const api = {
  get: async (path: string) => {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        ...authHeader,
      },
    });
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json();
  },

  post: async (path: string, body: any, options?: RequestInit) => {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
      ...options,
    });
    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json();
  },

  delete: async (path: string) => {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        ...authHeader,
      },
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed`);
    return res.json();
  },
};
