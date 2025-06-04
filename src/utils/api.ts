const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json();
  },

  post: async (path: string, body: any, options?: RequestInit) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...options, // allows passing signal or others
    });
    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json();
  },

  delete: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE ${path} failed`);
    return res.json();
  },
};
