import { useState } from "react";
import {
  register,
  login,
  verifyEmail as apiVerifyEmail,
  resendVerificationEmail,
} from "../api/auth";

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
      const status = err.response?.status;
      let message = "Registrasi gagal";
      switch (status) {
        case 400:
          message = "Input tidak valid";
          break;
        case 409:
          message = "Email sudah digunakan";
          break;
        case 500:
          message = "Terjadi kesalahan pada server";
          break;
        default:
          message = "Registrasi gagal, silakan coba lagi";
      }
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      localStorage.setItem("userIdLexMedica", response.id);
      localStorage.setItem("userEmailLexMedica", response.email);
      localStorage.setItem("userTokenLexMedica", response.token);
      localStorage.setItem("userRefreshTokenLexMedica", response.refreshToken);
      return response;
    } catch (err: any) {
      const status = err.response?.status;
      let message = "Login failed";
      switch (status) {
        case 400:
          message = "Input tidak valid";
          break;
        case 401:
          message = "Email atau password salah";
          break;
        case 403:
          message = "Akun belum terverifikasi, cek email (atau folder spam)";
          break;
        case 404:
          message = "Akun belum terdaftar, silakan daftar terlebih dahulu";
          break;
        default:
          message = "Terjadi kesalahan server, coba lagi nanti";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiVerifyEmail(token);
      return { success: true, message: res.message };
    } catch (err: any) {
      const status = err.response?.status;
      let message = "Verifikasi gagal";
      if (status === 401) message = "Token tidak valid atau telah expired";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resendEmailVerification = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resendVerificationEmail(email);
      return { success: true, message: res.message };
    } catch (err: any) {
      setError("Gagal mengirim ulang email verifikasi");
      return {
        success: false,
        message: "Gagal mengirim ulang email verifikasi",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    handleLogin,
    verifyEmail,
    resendEmailVerification,
    error,
    loading,
  };
};
