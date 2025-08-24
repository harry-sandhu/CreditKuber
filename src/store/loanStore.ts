import { create } from "zustand";
import api from "@/lib/api";

export interface Loan {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "active" | "closed";
  createdAt: string;
  updatedAt: string;
}

interface LoanState {
  loans: Loan[];
  loading: boolean;
  error: string | null;

  fetchLoans: () => Promise<void>;
  applyLoan: (data: { amount: number }) => Promise<void>;
  clearLoans: () => void;
}

export const useLoanStore = create<LoanState>((set) => ({
  loans: [],
  loading: false,
  error: null,

  fetchLoans: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/loans");
      set({ loans: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load loans", loading: false });
    }
  },

  applyLoan: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/loans/apply", data);
      // Refresh after apply
      const res = await api.get("/loans");
      set({ loans: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Loan application failed", loading: false });
    }
  },

  clearLoans: () => set({ loans: [] }),
}));
