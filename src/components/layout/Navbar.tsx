// src/components/layout/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout?.();
    navigate(PATHS.auth.login, { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          to={PATHS.home}
          className="font-semibold tracking-tight text-primary"
        >
          CreditKuber
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <NavLink
            to={PATHS.about}
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-muted hover:text-primary"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to={PATHS.faq}
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-muted hover:text-primary"
              }`
            }
          >
            FAQ
          </NavLink>
          <NavLink
            to={PATHS.contact}
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-muted hover:text-primary"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted md:inline-flex">
                {user?.role?.toUpperCase()}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-border bg-transparent px-3 py-1.5 text-sm text-text hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to={PATHS.auth.login}
              className="rounded-xl bg-primary px-3 py-1.5 text-sm text-inverse hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] transition"
            >
              Sign in
            </Link>
          )}

          {/* Theme toggle - shared component so toggling in public/protected navbars stays in sync */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
