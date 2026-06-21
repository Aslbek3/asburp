import { useAuthStore } from "@/store/authStore";
import type { TeamRole } from "@/lib/types";

export type Capability = "manage" | "destructive" | "admin";

const matrix: Record<TeamRole, Capability[]> = {
  Admin: ["manage", "destructive", "admin"],
  Developer: ["manage"],
  Viewer: [],
};

export function useCan(capability: Capability) {
  const role = useAuthStore((s) => s.user.role);
  return matrix[role].includes(capability);
}
