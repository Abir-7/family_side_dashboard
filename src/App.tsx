import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth/AuthProvider";

import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OtpPage from "./pages/auth/OtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardLayout from "./layout/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import NotificationsPage from "./pages/NotificationsPage";
import ActivityPage from "./pages/ActivityPage";
import CreateActivityPage from "./pages/CreateActivityPage";
import UsersPage from "./pages/UsersPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="activity/create" element={<CreateActivityPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
