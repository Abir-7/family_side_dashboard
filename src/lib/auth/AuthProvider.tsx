import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useDispatch } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../redux/authSlice";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: any | null;
  }>(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
    
    return { isAuthenticated, accessToken, refreshToken, user };
  });

  const login = (data: { 
    accessToken: string; 
    refreshToken: string; 
    user: any 
  }) => {
    setAuthState({
      isAuthenticated: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user
    });

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    dispatch(loginAction({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user
    }));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null
    });

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
