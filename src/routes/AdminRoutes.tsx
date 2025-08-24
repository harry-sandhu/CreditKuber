import AdminDashboard from "@/pages/admin/Dashboard";
import LoanApplications from "@/pages/admin/LoanApplications";
import Users from "@/pages/admin/Users";
import Payments from "@/pages/admin/Payments";
import Reports from "@/pages/admin/Reports";
import Settings from "@/pages/admin/Settings";

const AdminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/applications", element: <LoanApplications /> },
  { path: "/admin/users", element: <Users /> },
  { path: "/admin/payments", element: <Payments /> },
  { path: "/admin/reports", element: <Reports /> },
  { path: "/admin/settings", element: <Settings /> },
];

export default AdminRoutes;
