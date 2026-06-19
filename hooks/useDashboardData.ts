import { useQuery } from "@tanstack/react-query";
import {
  fetchAlerts,
  fetchCpuSeries,
  fetchDeploys,
  fetchDomains,
  fetchProcesses,
} from "@/lib/api";

export function useProcesses() {
  return useQuery({ queryKey: ["processes"], queryFn: fetchProcesses });
}

export function useDeploys() {
  return useQuery({ queryKey: ["deploys"], queryFn: fetchDeploys });
}

export function useAlerts() {
  return useQuery({ queryKey: ["alerts"], queryFn: fetchAlerts });
}

export function useDomainsMini() {
  return useQuery({ queryKey: ["domains-mini"], queryFn: fetchDomains });
}

export function useCpuSeries(range: "1h" | "24h" | "7d") {
  return useQuery({
    queryKey: ["cpu-series", range],
    queryFn: () => fetchCpuSeries(range),
  });
}
