// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial session fetch + auth state listener
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(
        "Kredensial invalid. Pastikan akun telah terdaftar dan verifikasi email Anda."
      );
      return false;
    }

    return data.session;
  };

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${
          window.location.origin
        }/verify-email?email=${encodeURIComponent(email)}`,
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("User already registered")) {
        setError("Email telah terdaftar.");
      } else {
        setError(error.message);
      }
      return false;
    }

    return data.user;
  };

  const handleResendEmailVerification = async (email: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${
          window.location.origin
        }/verify-email?email=${encodeURIComponent(email)}`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return false;
    }

    return data.user;
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      console.error("Error logging out:", error.message);
      setError(error.message);
    } else {
      setSession(null);
      setUser(null);
    }
  };

  return {
    session,
    user,
    loading,
    error,
    handleRegister,
    handleResendEmailVerification,
    handleLogin,
    handleLogout,
  };
};
