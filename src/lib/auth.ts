import { useAuthStore } from "@/store/authStore";
import { ROLES } from "./constants";

/**
 * ✅ Check if the current user has a given role
 */
export function hasRole(role: string): boolean {
  const currentRole = useAuthStore.getState().role;
  return currentRole === role;
}

/**
 * ✅ Check if current user is among allowed roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const currentRole = useAuthStore.getState().role;
  return roles.includes(currentRole || "");
}

/**
 * ✅ Shorthand helpers for common roles
 */
export function isAdmin() {
  return hasRole(ROLES.ADMIN);
}

export function isSuperAdmin() {
  return hasRole(ROLES.SUPERADMIN);
}

export function isBorrower() {
  return hasRole(ROLES.BORROWER);
}

export function isCreditAnalyst() {
  return hasRole(ROLES.CREDIT_ANALYST);
}

export function isCollector() {
  return hasRole(ROLES.COLLECTOR);
}
