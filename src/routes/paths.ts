// Centralized paths so links/components stay in sync
export const PATHS = {
  home: "/",
  about: "/about",
  faq: "/faq",
  contact: "/contact",

  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgot: "/auth/forgot-password",
  },

  borrower: {
    dashboard: "/borrower/dashboard",
    apply: "/borrower/apply",
    loans: "/borrower/loans/:id",
    repayment: "/borrower/repayment",
    profile: "/borrower/profile",
  },

  admin: {
    dashboard: "/admin/dashboard",
    applications: "/admin/applications",
    users: "/admin/users",
    payments: "/admin/payments",
    reports: "/admin/reports",
    settings: "/admin/settings",
    callings: "/admin/callings",
    collection: "/admin/collection",
    credit: "/admin/credit",
    disbursal: "/admin/disbursal",
    leads: "/admin/leads",
    loanReports: "/admin/loan-reports",
    paymentDueDate: "/admin/payment-due-date",
  },

  officer: {
    review: "/officer/review",
    risk: "/officer/risk",
  },

  collector: {
    overdues: "/collector/overdues",
    contacts: "/collector/contacts",
  },

  support: {
    tickets: "/support/tickets",
    grievance: "/support/grievance",
  },
};
