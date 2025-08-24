// src/routes/PageComponents.tsx
import BorrowerDashboard from "@/pages/borrower/Dashboard";
import ApplyLoan from "@/pages/borrower/ApplyLoan";
import LoanDetails from "@/pages/borrower/LoanDetails";
import Repayment from "@/pages/borrower/Repayment";
import Profile from "@/pages/borrower/Profile";

import AdminDashboard from "@/pages/admin/Dashboard";
import LoanApplications from "@/pages/admin/LoanApplications";
import Users from "@/pages/admin/Users";
import Payments from "@/pages/admin/Payments";
import Reports from "@/pages/admin/Reports";
import Settings from "@/pages/admin/Settings";

import ReviewApplications from "@/pages/officer/ReviewApplications";
import RiskAssessment from "@/pages/officer/RiskAssessment";

import Overdues from "@/pages/collector/Overdues";
import ContactBorrowers from "@/pages/collector/ContactBorrowers";

import Unauthorized from "@/pages/Unauthorized";

export const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  // Borrower
  "borrower/dashboard": BorrowerDashboard,
  "borrower/apply": ApplyLoan,
  "borrower/loans/:id": LoanDetails,
  "borrower/repayment": Repayment,
  "borrower/profile": Profile,

  // Admin
  "admin/dashboard": AdminDashboard,
  "admin/applications": LoanApplications,
  "admin/users": Users,
  "admin/payments": Payments,
  "admin/reports": Reports,
  "admin/settings": Settings,

  // Credit Analyst
  "credit_analyst/review": ReviewApplications,
  "credit_analyst/risk": RiskAssessment,

  // Collector
  "collector/overdues": Overdues,
  "collector/contact": ContactBorrowers,

  // Unauthorized
  unauthorized: Unauthorized,
};
