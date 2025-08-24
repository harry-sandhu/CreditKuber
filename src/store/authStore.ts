import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES } from "@/lib/constants";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          role: user.role,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
