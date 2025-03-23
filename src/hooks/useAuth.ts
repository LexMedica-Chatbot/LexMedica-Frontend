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
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token); // Store token
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, handleLogin, error, loading };
};
