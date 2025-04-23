import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

// Define context type
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to consume context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
