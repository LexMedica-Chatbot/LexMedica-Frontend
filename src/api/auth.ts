// Desc: Auth API functions for user registration, login, and email verification
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

export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  const response = await httpClient.get(`/auth/verify_email/${token}`);
  return response.data;
};

export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  const response = await httpClient.post("/auth/resend_email_verification", {
    email,
  });
  return response.data;
};
