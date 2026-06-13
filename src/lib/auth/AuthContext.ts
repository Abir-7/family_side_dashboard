import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    userType: string;
    isEmailVerified: boolean;
    onboardingCompleted: boolean;
  } | null;
  login: (data: { 
    accessToken: string; 
    refreshToken: string; 
    user: AuthContextType["user"] 
  }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
