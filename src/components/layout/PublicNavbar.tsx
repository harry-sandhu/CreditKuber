import { Link, NavLink } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to={PATHS.home} className="text-xl font-bold text-primary">
          CreditKuber
        </Link>

        {/* Nav links */}
        <nav className="flex gap-6">
          <NavLink
            to={PATHS.about}
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-primary font-semibold"
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
                  ? "text-primary font-semibold"
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
                  ? "text-primary font-semibold"
                  : "text-muted hover:text-primary"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right section: Auth buttons + Theme Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to={PATHS.auth.login}
            className="rounded-lg border border-primary px-4 py-1.5 text-sm text-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] transition"
          >
            Login
          </Link>
          <Link
            to={PATHS.auth.register}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm text-inverse shadow-soft hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] transition"
          >
            Register
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
