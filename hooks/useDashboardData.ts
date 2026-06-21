import { useQuery } from "@tanstack/react-query";
import {
  fetchAlerts,
  fetchCpuSeries,
  fetchDeploys,
  fetchDomains,
  fetchMetrics,
  fetchProcesses,
} from "@/lib/api";

export function useMetrics() {
  return useQuery({ queryKey: ["metrics"], queryFn: fetchMetrics, refetchInterval: 1_000 });
}

export function useProcesses() {
  return useQuery({ queryKey: ["processes"], queryFn: fetchProcesses, refetchInterval: 15_000 });
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
    refetchInterval: 30_000,
  });
}
