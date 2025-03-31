import { useState } from "react";
import { register, login } from "../api/auth";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(email, password);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      // Store in local storage
      localStorage.setItem("emailLexMedica", response.email);
      localStorage.setItem("tokenLexMedica", response.token);
      localStorage.setItem("refreshTokenLexMedica", response.refreshToken);

      console.log("Login successful:", response.email);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  return { handleRegister, handleLogin, error, loading };
};
