import { create } from "zustand";

type LogLevel = "all" | "error" | "warning" | "info" | "debug";

interface LogState {
  vps: string;
  project: string;
  level: LogLevel;
  search: string;
  setVps: (v: string) => void;
  setProject: (v: string) => void;
  setLevel: (v: LogLevel) => void;
  setSearch: (v: string) => void;
}

export const useLogStore = create<LogState>((set) => ({
  vps: "contabo-de-01",
  project: "Barchasi",
  level: "all",
  search: "",
  setVps: (v) => set({ vps: v }),
  setProject: (v) => set({ project: v }),
  setLevel: (v) => set({ level: v }),
  setSearch: (v) => set({ search: v }),
}));
