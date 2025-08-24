import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { PAGE_COMPONENTS } from "@/mappings/RoleRoutesMapping";

interface RoleRoutesProps {
  backendRoleRoutes: Record<string, string[]>; // role -> allowed pages
}

export default function RoleRoutes({ backendRoleRoutes }: RoleRoutesProps) {
  const { role } = useAuthStore();

  // If user has no role, redirect to login
  if (!role) return <Navigate to="/login" replace />;

  // Get allowed pages for this role
  const allowedRoutes = backendRoleRoutes[role] || [];

  return (
    <Routes>
      {allowedRoutes.map((routePath) => {
        const Component = PAGE_COMPONENTS[`${role}/${routePath}`];
        if (!Component) return null; // skip if not defined
        return (
          <Route key={routePath} path={routePath} element={<Component />} />
        );
      })}

      {/* Catch-all for unauthorized or undefined pages */}
      {(() => {
        const Unauthorized = PAGE_COMPONENTS["unauthorized"];
        return <Route path="*" element={<Unauthorized />} />;
      })()}
    </Routes>
  );
}
