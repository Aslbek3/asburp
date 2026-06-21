import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsTab = "profil" | "panel" | "bildirishnomalar" | "api" | "backup";

interface ProfilData {
  name: string;
  email: string;
  role: string;
}

interface PanelData {
  panelName: string;
  timezone: string;
  language: string;
}

interface NotificationsData {
  deploy: boolean;
  alerts: boolean;
  ssl: boolean;
  weeklyReport: boolean;
}

export interface ApiKeyData {
  id: string;
  name: string;
  created: string;
  lastUsed: string;
}

interface SettingsState {
  activeTab: SettingsTab;
  setActiveTab: (v: SettingsTab) => void;
  profil: ProfilData;
  panel: PanelData;
  bildirishnomalar: NotificationsData;
  apiKeys: ApiKeyData[];
  setProfil: (v: Partial<ProfilData>) => void;
  setPanel: (v: Partial<PanelData>) => void;
  setNotification: (key: keyof NotificationsData, value: boolean) => void;
  revokeApiKey: (id: string) => void;
  restoreApiKey: (key: ApiKeyData) => void;
  createApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeTab: "profil",
      setActiveTab: (v) => set({ activeTab: v }),
      profil: { name: "Aslbek Ismatov", email: "admin@corepanel.uz", role: "Admin" },
      panel: { panelName: "CorePanel", timezone: "Europe/Berlin", language: "O'zbek" },
      bildirishnomalar: { deploy: true, alerts: true, ssl: true, weeklyReport: false },
      apiKeys: [{ id: "k1", name: "CI Token", created: "2026-03-01", lastUsed: "18 daqiqa oldin" }],
      setProfil: (v) => set((s) => ({ profil: { ...s.profil, ...v } })),
      setPanel: (v) => set((s) => ({ panel: { ...s.panel, ...v } })),
      setNotification: (key, value) =>
        set((s) => ({ bildirishnomalar: { ...s.bildirishnomalar, [key]: value } })),
      revokeApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),
      restoreApiKey: (key) => set((s) => ({ apiKeys: [...s.apiKeys, key] })),
      createApiKey: () =>
        set((s) => ({
          apiKeys: [
            ...s.apiKeys,
            {
              id: `k${Date.now()}`,
              name: `Yangi kalit ${s.apiKeys.length + 1}`,
              created: new Date().toISOString().slice(0, 10),
              lastUsed: "hali ishlatilmagan",
            },
          ],
        })),
    }),
    {
      name: "corepanel-settings",
      partialize: (s) => ({
        profil: s.profil,
        panel: s.panel,
        bildirishnomalar: s.bildirishnomalar,
        apiKeys: s.apiKeys,
      }),
    },
  ),
);
