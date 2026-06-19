import { create } from "zustand";

type StatusFilter = "all" | "online" | "offline";

interface ServerState {
  search: string;
  statusFilter: StatusFilter;
  selectedServerId: string | null;
  setSearch: (v: string) => void;
  setStatusFilter: (v: StatusFilter) => void;
  setSelectedServerId: (id: string) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  search: "",
  statusFilter: "all",
  selectedServerId: "contabo-de-01",
  setSearch: (v) => set({ search: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setSelectedServerId: (id) => set({ selectedServerId: id }),
}));
