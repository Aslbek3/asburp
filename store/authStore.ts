import { useCallback, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  name: string;
  email: string;
  role: "Admin" | "Developer" | "Viewer";
  initials: string;
}

interface AuthState {
  loggedIn: boolean;
  user: AuthUser;
  login: () => void;
  logout: () => void;
}

const defaultUser: AuthUser = {
  name: "Aslbek Ismatov",
  email: "admin@corepanel.uz",
  role: "Admin",
  initials: "AI",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loggedIn: false,
      user: defaultUser,
      login: () => set({ loggedIn: true }),
      logout: () => set({ loggedIn: false }),
    }),
    { name: "corepanel-auth" },
  ),
);

export function useAuthHydrated() {
  const subscribe = useCallback(
    (onChange: () => void) => useAuthStore.persist.onFinishHydration(onChange),
    [],
  );
  const getSnapshot = useCallback(() => useAuthStore.persist.hasHydrated(), []);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
