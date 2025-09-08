// Use in Sidebar to drive menu by role
import { PATHS } from "@/routes/paths";

export type AppRole =
  | "borrower"
  | "admin"
  | "officer"
  | "collector"
  | "support";

export const ROLE_ROUTES: Record<AppRole, { to: string; label: string }[]> = {
  borrower: [
    { to: PATHS.borrower.dashboard, label: "Dashboard" },
    { to: PATHS.borrower.apply, label: "Apply Loan" },
    { to: PATHS.borrower.repayment, label: "Repayment" },
    { to: PATHS.borrower.profile, label: "Profile" },
  ],
  admin: [
    { to: PATHS.admin.dashboard, label: "Dashboard" },
    { to: PATHS.admin.applications, label: "Loan Applications" },
    { to: PATHS.admin.users, label: "Users" },
    { to: PATHS.admin.payments, label: "Payments" },
    { to: PATHS.admin.reports, label: "Reports" },
    { to: PATHS.admin.settings, label: "Settings" },

    { to: PATHS.admin.collection, label: "Collection" },
    { to: PATHS.admin.callings, label: "Callings" },
    { to: PATHS.admin.credit, label: "Credit" },
    { to: PATHS.admin.disbursal, label: "Disbursal" },
    { to: PATHS.admin.leads, label: "Leads" },
    { to: PATHS.admin.loanReports, label: "Loan Reports" },
    { to: PATHS.admin.paymentDueDate, label: "Payment Due Date" },
  ],
  officer: [
    { to: PATHS.officer.review, label: "Review Applications" },
    { to: PATHS.officer.risk, label: "Risk Assessment" },
  ],
  collector: [
    { to: PATHS.collector.overdues, label: "Overdues" },
    { to: PATHS.collector.contacts, label: "Contact Borrowers" },
  ],
  support: [
    { to: PATHS.support.tickets, label: "Tickets" },
    { to: PATHS.support.grievance, label: "Grievance Form" },
  ],
};
