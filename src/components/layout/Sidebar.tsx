// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/mappings/RoleRoutesMapping";

// 🔹 Define readable labels for each route
const ROUTE_LABELS: Record<string, string> = {
  "/borrower/dashboard": "Dashboard",
  "/borrower/apply": "Apply Loan",
  "/borrower/loans/:id": "My Loans",
  "/borrower/repayment": "Repayment",
  "/borrower/profile": "Profile",

  "/admin/dashboard": "Dashboard",
  "/admin/applications": "Loan Applications",
  "/admin/users": "Users",
  "/admin/payments": "Payments",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",

  "/officer/review": "Review Applications",
  "/officer/risk": "Risk Assessment",

  "/collector/overdues": "Overdues",
  "/collector/contact": "Contact Borrowers",
};

export default function Sidebar() {
  const { role } = useAuthStore();
  const roleRoutes = ROLE_ROUTES[role || "borrower"] || [];

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">Menu</div>
      <ul className="space-y-2 p-4">
        {roleRoutes.map((route) => {
          // Skip routes without a path
          if (!route.path) return null;

          // Remove route params (like :id)
          const path = route.path.replace(/:\w+/g, "");

          return (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                {ROUTE_LABELS[route.path] || path}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
