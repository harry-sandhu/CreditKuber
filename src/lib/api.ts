// src/lib/api.ts
// Mock API that imitates axios for login & logout.
// Replace with a real axios instance when backend is ready.

import { useAuthStore } from "@/store/authStore";

type LoginPayload = { email: string; password: string };
type User = { id: string; name: string; role: string; email: string };
type ApiResponse<T> = { status: number; data: T };

const DELAY_MS = 400; // fake network latency

// 🔹 Hardcoded users (for dev/demo)
const users: Array<{
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
}> = [
  {
    id: "1",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    id: "2",
    email: "borrower@test.com",
    password: "borrower123",
    role: "borrower",
    name: "Borrower One",
  },
  {
    id: "3",
    email: "officer@test.com",
    password: "officer123",
    role: "officer",
    name: "Credit Officer",
  },
  {
    id: "4",
    email: "collector@test.com",
    password: "collector123",
    role: "collector",
    name: "Collections",
  },
  {
    id: "5",
    email: "support@test.com",
    password: "support123",
    role: "support",
    name: "support",
  },
];

// 🔹 Helper to simulate async wait
function wait<T>(value: T, ms = DELAY_MS) {
  return new Promise<T>((res) => setTimeout(() => res(value), ms));
}

// 🔹 Mock API object
const api = {
  // Mimics axios.post
  post: (url: string, payload?: any): Promise<ApiResponse<any>> => {
    if (url === "/auth/login") {
      const { email, password } = payload as LoginPayload;
      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (found) {
        const token = "mock-jwt-token-12345";

        // update Zustand store directly
        useAuthStore.getState().login(
          {
            id: found.id,
            name: found.name,
            role: found.role as any,
            email: found.email,
          },
          token
        );

        const response: ApiResponse<{
          token: string;
          role: string;
          user: User;
        }> = {
          status: 200,
          data: {
            token,
            role: found.role,
            user: {
              id: found.id,
              name: found.name,
              role: found.role,
              email: found.email,
            },
          },
        };

        return wait(response);
      }

      // invalid credentials
      return new Promise((_, rej) =>
        setTimeout(
          () =>
            rej({
              response: {
                status: 401,
                data: { message: "Invalid credentials" },
              },
            }),
          DELAY_MS
        )
      );
    }

    // unknown endpoint
    return new Promise((_, rej) =>
      setTimeout(
        () =>
          rej({
            response: {
              status: 404,
              data: { message: `Mock API: Endpoint ${url} not found` },
            },
          }),
        DELAY_MS
      )
    );
  },

  // 🔹 Mimic logout
  logout: async () => {
    useAuthStore.getState().logout();
    return wait({ status: 200, data: { message: "Logged out" } });
  },
};

export default api;
