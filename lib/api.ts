import {
  alerts,
  auditRows,
  cpuSeries,
  dbGroups,
  deployHistory,
  deployLog,
  deployPipeline,
  domainRows,
  emailAccounts,
  fileRows,
  logLines,
  procRaw,
  projRaw,
  serversRaw,
  SETTINGS,
  sslRows,
  teamRows,
} from "./mock-data";

function delay<T>(data: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const fetchServers = () => delay(serversRaw);
export const fetchProjects = () => delay(projRaw);
export const fetchProcesses = () => delay(procRaw);
export const fetchDeploys = () => delay(deployHistory);
export const fetchAlerts = () => delay(alerts);
export const fetchDomains = () => delay(domainRows);
export const fetchSsl = () => delay(sslRows);
export const fetchDbGroups = () => delay(dbGroups);
export const fetchFiles = () => delay(fileRows);
export const fetchEmailAccounts = () => delay(emailAccounts);
export const fetchTeam = () => delay(teamRows);
export const fetchAudit = () => delay(auditRows);
export const fetchCpuSeries = (range: "1h" | "24h" | "7d") => delay(cpuSeries[range]);
export const fetchDeployLog = () => delay(deployLog);
export const fetchDeployPipeline = () => delay(deployPipeline);
export const fetchLogLines = () => delay(logLines);
export const fetchSettings = () => delay(SETTINGS);
