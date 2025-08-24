// src/components/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, role } = useAuthStore();

  // Not logged in → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // Logged in but role not allowed → redirect to home
  if (!allowedRoles.includes(role || "")) return <Navigate to="/" replace />;

  return <Outlet />;
}
