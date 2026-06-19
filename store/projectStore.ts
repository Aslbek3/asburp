import { create } from "zustand";

type TypeFilter = "all" | "bot" | "web" | "api";

interface ProjectState {
  search: string;
  typeFilter: TypeFilter;
  setSearch: (v: string) => void;
  setTypeFilter: (v: TypeFilter) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  search: "",
  typeFilter: "all",
  setSearch: (v) => set({ search: v }),
  setTypeFilter: (v) => set({ typeFilter: v }),
}));
