import { create } from "zustand";
import type { TeamRole } from "@/lib/types";

interface TeamState {
  roleOverrides: Record<string, TeamRole>;
  removedIds: string[];
  setRole: (id: string, role: TeamRole) => void;
  remove: (id: string) => void;
  restore: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  roleOverrides: {},
  removedIds: [],
  setRole: (id, role) => set((s) => ({ roleOverrides: { ...s.roleOverrides, [id]: role } })),
  remove: (id) => set((s) => ({ removedIds: [...s.removedIds, id] })),
  restore: (id) => set((s) => ({ removedIds: s.removedIds.filter((x) => x !== id) })),
}));
