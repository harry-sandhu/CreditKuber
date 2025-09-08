import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";

// Public pages
const Landing = lazy(() => import("@/pages/Landing"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Auth
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));

// Borrower
const BorrowerDashboard = lazy(() => import("@/pages/borrower/Dashboard"));
const ApplyLoan = lazy(() => import("@/pages/borrower/ApplyLoan"));
const LoanDetails = lazy(() => import("@/pages/borrower/LoanDetails"));
const Repayment = lazy(() => import("@/pages/borrower/Repayment"));
const Profile = lazy(() => import("@/pages/borrower/Profile"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const LoanApplications = lazy(() => import("@/pages/admin/LoanApplications"));
const Users = lazy(() => import("@/pages/admin/Users"));
const Payments = lazy(() => import("@/pages/admin/Payments"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const AdminCallings = lazy(() => import("@/pages/admin/Calling"));
const AdminCollection = lazy(() => import("@/pages/admin/Collection"));
const AdminCredit = lazy(() => import("@/pages/admin/Credit"));
const AdminDisbursal = lazy(() => import("@/pages/admin/Disbursal"));
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const AdminLoanReports = lazy(() => import("@/pages/admin/LoanReports"));
const AdminPaymentDueDate = lazy(() => import("@/pages/admin/PaymentDueDate"));

// Officer
const ReviewApplications = lazy(
  () => import("@/pages/officer/ReviewApplications")
);
const RiskAssessment = lazy(() => import("@/pages/officer/RiskAssessment"));

// Collector
const Overdues = lazy(() => import("@/pages/collector/Overdues"));
const ContactBorrowers = lazy(
  () => import("@/pages/collector/ContactBorrowers")
);

// Support
const Tickets = lazy(() => import("@/pages/support/Tickets"));
const GrievanceForm = lazy(() => import("@/pages/support/GrievanceForm"));

function Loader() {
  return <div className="p-6 text-sm text-gray-600">Loading…</div>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes (no layout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* App routes with layout + guards */}
        <Route element={<AppLayout />}>
          {/* Borrower */}
          <Route element={<ProtectedRoute allowRoles={["borrower"]} />}>
            <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
            <Route path="/borrower/apply" element={<ApplyLoan />} />
            <Route path="/borrower/loans/:id" element={<LoanDetails />} />
            <Route path="/borrower/repayment" element={<Repayment />} />
            <Route path="/borrower/profile" element={<Profile />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<LoanApplications />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/callings" element={<AdminCallings />} />
            <Route path="/admin/collection" element={<AdminCollection />} />
            <Route path="/admin/credit" element={<AdminCredit />} />
            <Route path="/admin/disbursal" element={<AdminDisbursal />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/loan-reports" element={<AdminLoanReports />} />
            <Route
              path="/admin/payment-due-date"
              element={<AdminPaymentDueDate />}
            />
          </Route>

          {/* Officer */}
          <Route element={<ProtectedRoute allowRoles={["officer"]} />}>
            <Route path="/officer/review" element={<ReviewApplications />} />
            <Route path="/officer/risk" element={<RiskAssessment />} />
          </Route>

          {/* Collector */}
          <Route element={<ProtectedRoute allowRoles={["collector"]} />}>
            <Route path="/collector/overdues" element={<Overdues />} />
            <Route path="/collector/contacts" element={<ContactBorrowers />} />
          </Route>

          {/* Support */}
          <Route element={<ProtectedRoute allowRoles={["support"]} />}>
            <Route path="/support/tickets" element={<Tickets />} />
            <Route path="/support/grievance" element={<GrievanceForm />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
