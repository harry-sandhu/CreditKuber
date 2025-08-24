// src/lib/constants.ts

/**
 * ✅ Role definitions
 */
export const ROLES = {
  BORROWER: "borrower",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  CREDIT_ANALYST: "officer",
  COLLECTOR: "collector",
  SUPPORT: "support",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * ✅ LocalStorage keys
 */
export const STORAGE_KEYS = {
  TOKEN: "CreditKuber_token",
  USER: "CreditKuber_user",
  ROLE: "CreditKuber_role",
};

/**
 * ✅ API endpoints (optional centralization)
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  LOANS: {
    APPLY: "/loans/apply",
    LIST: "/loans",
    DETAIL: (id: string | number) => `/loans/${id}`,
    REPAY: "/loans/repay",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string | number) => `/users/${id}`,
  },
};

/**
 * ✅ Common app constants
 */
export const APP = {
  NAME: "CreditKuber",
  COPYRIGHT: `© ${new Date().getFullYear()} LoanFlix. All rights reserved.`,
};
