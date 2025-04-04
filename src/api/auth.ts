import httpClient from "./httpClient";

interface AuthResponse {
  id: string;
  email: string;
  token: string;
  refreshToken: string;
  message?: string;
}

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>("/auth/register", {
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};
