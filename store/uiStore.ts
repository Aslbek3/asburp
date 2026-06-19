import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  cmdkOpen: boolean;
  toggleTheme: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setCmdkOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarOpen: false,
      cmdkOpen: false,
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", next);
        }
      },
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCmdkOpen: (open) => set({ cmdkOpen: open }),
    }),
    {
      name: "corepanel-ui",
      partialize: (s) => ({ theme: s.theme }),
    },
  ),
);
