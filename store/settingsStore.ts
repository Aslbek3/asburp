import { create } from "zustand";

type SettingsTab = "profil" | "panel" | "bildirishnomalar" | "api" | "backup";

interface SettingsState {
  activeTab: SettingsTab;
  setActiveTab: (v: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  activeTab: "profil",
  setActiveTab: (v) => set({ activeTab: v }),
}));
