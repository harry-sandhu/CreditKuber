import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore"; // adjust path

type Props = {
  allowRoles?: string[]; // if omitted, any logged-in user allowed
  redirectTo?: string;
};

export default function ProtectedRoute({
  allowRoles,
  redirectTo = "/auth/login",
}: Props) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (allowRoles && user && !allowRoles.includes(user.role)) {
    // If logged in but wrong role, send to a safe default
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
