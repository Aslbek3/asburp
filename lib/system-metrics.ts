import { exec } from "child_process";
import { readFile } from "fs/promises";
import os from "os";
import { promisify } from "util";
export { VPS_CONTABO_ID, VPS_CONTABO_NAME } from "./constants";

const execAsync = promisify(exec);

let cachedPublicIp: string | null = null;
let cachedOsName: string | null = null;

function cpuSnapshot() {
  let idle = 0;
  let total = 0;
  for (const cpu of os.cpus()) {
    for (const t of Object.values(cpu.times)) total += t;
    idle += cpu.times.idle;
  }
  return { idle, total };
}

export async function getCpuUsagePercent(sampleMs = 300): Promise<number> {
  const start = cpuSnapshot();
  await new Promise((r) => setTimeout(r, sampleMs));
  const end = cpuSnapshot();
  const idleDelta = end.idle - start.idle;
  const totalDelta = end.total - start.total;
  if (totalDelta <= 0) return 0;
  return Math.round(100 * (1 - idleDelta / totalDelta));
}

export function getMemoryUsagePercent(): number {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(100 * (1 - free / total));
}

export interface MemoryInfo {
  usedGb: number;
  totalGb: number;
  pct: number;
}

export function getMemoryInfo(): MemoryInfo {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    usedGb: Math.round((used / 1024 ** 3) * 10) / 10,
    totalGb: Math.round(total / 1024 ** 3),
    pct: Math.round(100 * (used / total)),
  };
}

export async function getDiskUsagePercent(): Promise<number> {
  const { stdout } = await execAsync("df -P -k /");
  const line = stdout.trim().split("\n").at(-1) ?? "";
  const parts = line.split(/\s+/);
  const used = Number(parts[2]);
  const avail = Number(parts[3]);
  const total = used + avail;
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

export interface DiskInfo {
  usedGb: number;
  totalGb: number;
  pct: number;
}

export async function getDiskInfo(): Promise<DiskInfo> {
  const { stdout } = await execAsync("df -P -k /");
  const line = stdout.trim().split("\n").at(-1) ?? "";
  const parts = line.split(/\s+/);
  const usedKb = Number(parts[2]);
  const availKb = Number(parts[3]);
  const totalKb = usedKb + availKb;
  return {
    usedGb: Math.round((usedKb / 1024 / 1024) * 10) / 10,
    totalGb: Math.round(totalKb / 1024 / 1024),
    pct: totalKb ? Math.round((usedKb / totalKb) * 100) : 0,
  };
}

export function getLoadAvgString(): string {
  return os
    .loadavg()
    .map((n) => n.toFixed(2))
    .join(", ");
}

export function getUptimeString(): string {
  const seconds = os.uptime();
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days} kun ${hours} soat`;
  return `${hours} soat`;
}

async function readNetTotals(): Promise<number> {
  const raw = await readFile("/proc/net/dev", "utf8");
  let total = 0;
  for (const line of raw.trim().split("\n").slice(2)) {
    const [iface, rest] = line.split(":");
    if (!rest || iface.trim() === "lo") continue;
    const fields = rest.trim().split(/\s+/).map(Number);
    const rxBytes = fields[0];
    const txBytes = fields[8];
    total += rxBytes + txBytes;
  }
  return total;
}

export async function getNetworkRateMbps(sampleMs = 120): Promise<number> {
  const start = await readNetTotals();
  await new Promise((r) => setTimeout(r, sampleMs));
  const end = await readNetTotals();
  const bytesPerSec = ((end - start) / sampleMs) * 1000;
  return Math.round((bytesPerSec / (1024 * 1024)) * 10) / 10;
}

export async function getNetworkRate(sampleMs = 300): Promise<string> {
  const mbPerSec = await getNetworkRateMbps(sampleMs);
  return `${mbPerSec.toFixed(1)} MB/s`;
}

export async function getOsName(): Promise<string> {
  if (cachedOsName) return cachedOsName;
  try {
    const raw = await readFile("/etc/os-release", "utf8");
    const match = raw.match(/PRETTY_NAME="(.+)"/);
    cachedOsName = match?.[1] ?? os.type();
  } catch {
    cachedOsName = os.type();
  }
  return cachedOsName;
}

export async function getPublicIp(): Promise<string> {
  if (cachedPublicIp) return cachedPublicIp;
  try {
    const res = await fetch("https://api.ipify.org?format=text", {
      signal: AbortSignal.timeout(3000),
    });
    cachedPublicIp = (await res.text()).trim();
  } catch {
    cachedPublicIp = "—";
  }
  return cachedPublicIp;
}

export interface RawPm2Process {
  pm_id: number;
  name: string;
  pm2_env: { status: string; restart_time: number; pm_uptime: number };
  monit: { cpu: number; memory: number };
}

export async function getPm2Processes(): Promise<RawPm2Process[]> {
  try {
    const { stdout } = await execAsync("pm2 jlist");
    return JSON.parse(stdout) as RawPm2Process[];
  } catch {
    return [];
  }
}

export function formatProcessUptime(pmUptimeMs: number, status: string): string {
  if (status !== "online") return "0m";
  const ms = Date.now() - pmUptimeMs;
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
