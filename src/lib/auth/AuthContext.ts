import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
