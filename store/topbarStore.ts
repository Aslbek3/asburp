import { create } from "zustand";
import type { LucideIcon } from "lucide-react";

export interface TopbarAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  primary?: boolean;
}

interface TopbarState {
  actions: TopbarAction[];
  setActions: (actions: TopbarAction[]) => void;
}

export const useTopbarStore = create<TopbarState>((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
}));
