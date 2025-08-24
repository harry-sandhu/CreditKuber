import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  modal: string | null; // name of open modal

  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
  toggleTheme: () => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  modal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (value) => set({ sidebarOpen: value }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  openModal: (modalName) => set({ modal: modalName }),
  closeModal: () => set({ modal: null }),
}));
