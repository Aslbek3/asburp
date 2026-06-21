import type { CpuPoint, DeployRow, AlertRow, DomainRow, ProcessRow, ServerRow } from "./types";
import {
  auditRows,
  dbGroups,
  deployLog,
  deployPipeline,
  emailAccounts,
  fileRows,
  logLines,
  projRaw,
  SETTINGS,
  sslRows,
  teamRows,
} from "./mock-data";

function delay<T>(data: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export interface DashboardMetrics {
  cpu: { pct: number; trend: number | null };
  ram: { usedGb: number; totalGb: number; pct: number };
  disk: { usedGb: number; totalGb: number; pct: number };
  network: { mbps: number };
}

export const fetchServers = () => fetchJson<ServerRow[]>("/api/servers");
export const fetchMetrics = () => fetchJson<DashboardMetrics>("/api/metrics");
export const fetchProjects = () => delay(projRaw);
export const fetchProcesses = () => fetchJson<ProcessRow[]>("/api/processes");
export const fetchDeploys = () => fetchJson<DeployRow[]>("/api/deploys");
export const fetchAlerts = () => fetchJson<AlertRow[]>("/api/alerts");
export const fetchDomains = () => fetchJson<DomainRow[]>("/api/domains");
export const fetchSsl = () => delay(sslRows);
export const fetchDbGroups = () => delay(dbGroups);
export const fetchFiles = () => delay(fileRows);
export const fetchEmailAccounts = () => delay(emailAccounts);
export const fetchTeam = () => delay(teamRows);
export const fetchAudit = () => delay(auditRows);
export const fetchCpuSeries = (range: "1h" | "24h" | "7d") =>
  fetchJson<CpuPoint[]>(`/api/cpu-series?range=${range}`);
export const fetchDeployLog = () => delay(deployLog);
export const fetchDeployPipeline = () => delay(deployPipeline);
export const fetchLogLines = () => delay(logLines);
export const fetchSettings = () => delay(SETTINGS);
