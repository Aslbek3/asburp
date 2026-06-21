import { exec } from "child_process";
import { promisify } from "util";
import type { ProcessRow, ServerRow } from "./types";
import type { VpsConnection } from "./vps-store";
import type { RawPm2Process } from "./system-metrics";
import { formatProcessUptime } from "./system-metrics";

const execAsync = promisify(exec);

const SSH_KEY_PATH = "/root/.ssh/corepanel_backend_ed25519";
const SECTION = "__CP_SECTION__";

const REMOTE_COMMAND = [
  `echo ${SECTION}LOAD`,
  "cat /proc/loadavg",
  `echo ${SECTION}TOP`,
  "top -bn1 | head -5",
  `echo ${SECTION}MEM`,
  "free -m",
  `echo ${SECTION}DISK`,
  "df -P -k /",
  `echo ${SECTION}UPTIME`,
  "cat /proc/uptime",
  `echo ${SECTION}OS`,
  "cat /etc/os-release 2>/dev/null",
  `echo ${SECTION}PM2`,
  "pm2 jlist 2>/dev/null || echo []",
].join(" && ");

function parseSections(stdout: string): Record<string, string> {
  const parts = stdout.split(`${SECTION}`).slice(1);
  const sections: Record<string, string> = {};
  for (const part of parts) {
    const newlineIdx = part.indexOf("\n");
    const key = part.slice(0, newlineIdx).trim();
    sections[key] = part.slice(newlineIdx + 1).trim();
  }
  return sections;
}

function parseCpuPercentFromTop(topOutput: string): number {
  const match = topOutput.match(/(\d+(?:\.\d+)?)\s*id/);
  if (!match) return 0;
  const idle = parseFloat(match[1]);
  return Math.round(100 - idle);
}

function parseMemPercent(freeOutput: string): number {
  const line = freeOutput.split("\n").find((l) => l.startsWith("Mem:"));
  if (!line) return 0;
  const fields = line.split(/\s+/);
  const total = Number(fields[1]);
  const used = Number(fields[2]);
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

function parseDiskPercent(dfOutput: string): number {
  const line = dfOutput.trim().split("\n").at(-1) ?? "";
  const fields = line.split(/\s+/);
  const used = Number(fields[2]);
  const avail = Number(fields[3]);
  const total = used + avail;
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

function parseUptimeString(uptimeOutput: string): string {
  const seconds = parseFloat(uptimeOutput.split(/\s+/)[0] ?? "0");
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days} kun ${hours} soat`;
  return `${hours} soat`;
}

function parseOsName(osReleaseOutput: string): string {
  const match = osReleaseOutput.match(/PRETTY_NAME="(.+)"/);
  return match?.[1] ?? "Noma'lum";
}

export async function fetchRemoteServer(
  conn: VpsConnection,
): Promise<{ server: ServerRow; processes: ProcessRow[] }> {
  const sshCmd = [
    "ssh",
    "-i",
    SSH_KEY_PATH,
    "-p",
    String(conn.port),
    "-o",
    "BatchMode=yes",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-o",
    "ConnectTimeout=5",
    `${conn.sshUser}@${conn.ip}`,
    `"${REMOTE_COMMAND}"`,
  ].join(" ");

  try {
    const { stdout } = await execAsync(sshCmd, { timeout: 15_000 });
    const sections = parseSections(stdout);

    const cpu = parseCpuPercentFromTop(sections.TOP ?? "");
    const ram = parseMemPercent(sections.MEM ?? "");
    const disk = parseDiskPercent(sections.DISK ?? "");
    const loadParts = (sections.LOAD ?? "").split(/\s+/).slice(0, 3);
    const load = loadParts.map((n) => Number(n).toFixed(2)).join(", ");

    let pm2List: RawPm2Process[] = [];
    try {
      pm2List = JSON.parse(sections.PM2 ?? "[]");
    } catch {
      pm2List = [];
    }

    const processes: ProcessRow[] = pm2List.map((p) => ({
      id: `${conn.id}-p${p.pm_id}`,
      pmid: p.pm_id,
      name: p.name,
      serverId: conn.id,
      cpu: `${p.monit.cpu}%`,
      mem: `${Math.round(p.monit.memory / (1024 * 1024))}mb`,
      restarts: p.pm2_env.restart_time,
      status: p.pm2_env.status === "online" ? "online" : p.pm2_env.status === "stopped" ? "stopped" : "errored",
      uptime: formatProcessUptime(p.pm2_env.pm_uptime, p.pm2_env.status),
    }));

    const server: ServerRow = {
      id: conn.id,
      name: conn.name,
      ip: conn.ip,
      location: "—",
      os: parseOsName(sections.OS ?? ""),
      status: "online",
      tags: ["Remote", "SSH"],
      cpu,
      ram,
      disk,
      projects: processes.filter((p) => p.status === "online").length,
      uptime: parseUptimeString(sections.UPTIME ?? "0"),
      uptimePct: "—",
      network: "—",
      availability: "—",
      load: load || "—",
    };

    return { server, processes };
  } catch {
    const server: ServerRow = {
      id: conn.id,
      name: conn.name,
      ip: conn.ip,
      location: "—",
      os: "—",
      status: "offline",
      tags: ["Remote", "SSH"],
      cpu: 0,
      ram: 0,
      disk: 0,
      projects: 0,
      uptime: "—",
      uptimePct: "—",
      network: "—",
      availability: "—",
      load: "—",
    };
    return { server, processes: [] };
  }
}
