import { create } from "zustand";

interface DatabaseState {
  removedIds: string[];
  remove: (id: string) => void;
  restore: (id: string) => void;
}

export const useDatabaseStore = create<DatabaseState>((set) => ({
  removedIds: [],
  remove: (id) => set((s) => ({ removedIds: [...s.removedIds, id] })),
  restore: (id) => set((s) => ({ removedIds: s.removedIds.filter((x) => x !== id) })),
}));
