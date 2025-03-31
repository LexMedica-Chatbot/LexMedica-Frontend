import httpClient from "./httpClient";

interface AuthResponse {
  email: string;
  token: string;
  refreshToken: string;
  message?: string;
}

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>("/register", {
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>("/login", {
    email,
    password,
  });
  return response.data;
};
