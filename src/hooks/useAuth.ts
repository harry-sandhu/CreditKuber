import { useAuthStore } from "@/store/authStore";

/**
 * Custom hook to access authentication info
 * Returns user, role, and token
 */
export function useAuth() {
  const { user, role, token } = useAuthStore();

  /**
   * ✅ Optional helper: check if logged in
   */
  const isLoggedIn = !!token;

  /**
   * ✅ Optional helper: check for specific role
   */
  const hasRole = (checkRole: string) => role === checkRole;

  return { user, role, token, isLoggedIn, hasRole };
}
