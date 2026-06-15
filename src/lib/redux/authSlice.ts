import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
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
}

const storedToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");
const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  accessToken: storedToken,
  refreshToken: storedRefreshToken,
  user: storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: AuthState["user"];
      }>,
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
