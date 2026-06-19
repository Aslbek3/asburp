import { useQuery } from "@tanstack/react-query";
import { fetchServers } from "@/lib/api";

export function useServers() {
  return useQuery({ queryKey: ["servers"], queryFn: fetchServers });
}
