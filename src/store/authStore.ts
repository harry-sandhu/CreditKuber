// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppRole =
  | "borrower"
  | "admin"
  | "officer"
  | "collector"
  | "support";

export interface User {
  id: string;
  name: string;
  role: AppRole;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearToken: () => void;
}

// Persist auth to localStorage (dev convenience).
// WARNING: persisted tokens in localStorage are vulnerable to XSS. Use httpOnly cookies in production.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // localStorage key
      // optionally: partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
