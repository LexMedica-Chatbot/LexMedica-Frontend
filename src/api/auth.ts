// Desc: Auth API functions for user registration, login, and email verification
import httpClient from "./httpClient";

// ** Types Import
import { User } from "../types/User";

/**
 * Register a new user.
 * @param email The user's email address.
 * @param password The user's password.
 */
export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await httpClient.post<User>("/auth/register", {
    email,
    password,
  });
  return response.data;
};

/**
 * Login a user.
 * @param email The user's email address.
 * @param password The user's password.
 */
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await httpClient.post<User>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

/**
 * Verify user email address after registration.
 * @param token The verification token sent to the user's email.
 */
export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  const response = await httpClient.get(`/auth/verify_email/${token}`);
  return response.data;
};

/**
 * Resend verification email to the user.
 * @param email The user's email address.
 */
export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  const response = await httpClient.post("/auth/resend_email_verification", {
    email,
  });
  return response.data;
};
