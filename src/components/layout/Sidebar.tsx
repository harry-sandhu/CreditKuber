import { NavLink } from "react-router-dom";
import { ROLE_ROUTES } from "@/mappings/RoleRouteMapping";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const { user, isAuthenticated } = useAuthStore();

  // No sidebar on public/auth pages
  if (!isAuthenticated || !user?.role) {
    return null;
  }

  const items = ROLE_ROUTES[user.role] ?? [];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {user.role} menu
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-text hover:bg-surface/80 hover:text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
