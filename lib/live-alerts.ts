import type { AlertRow } from "./types";
import { getDiskInfo, getCpuUsagePercent, getPm2Processes } from "./system-metrics";
import { listConnections } from "./vps-store";
import { fetchRemoteServer } from "./remote-metrics";
import { listNginxDomains } from "./nginx-domains";

export async function buildLiveAlerts(): Promise<AlertRow[]> {
  const [disk, cpu, processes, connections, domains] = await Promise.all([
    getDiskInfo(),
    getCpuUsagePercent(),
    getPm2Processes(),
    listConnections(),
    listNginxDomains(),
  ]);

  const alerts: AlertRow[] = [];
  let seq = 1;
  const nextId = () => `live-a${seq++}`;

  if (disk.pct >= 80) {
    alerts.push({
      id: nextId(),
      level: disk.pct >= 90 ? "error" : "warning",
      text: `vps contabo disk hajmi ${disk.pct}% ga yetdi (${disk.usedGb}GB / ${disk.totalGb}GB)`,
      time: "hozir",
      href: "/servers/vps-contabo",
    });
  }

  if (cpu >= 90) {
    alerts.push({
      id: nextId(),
      level: "warning",
      text: `vps contabo CPU yuklamasi ${cpu}% — yuqori`,
      time: "hozir",
      href: "/servers/vps-contabo",
    });
  }

  for (const p of processes) {
    const upMinutes = (Date.now() - p.pm2_env.pm_uptime) / 60000;
    // Faqat tez-tez (oxirgi necha daqiqada bir nechta marta) qayta ishga tushgan
    // jarayonlarni belgilaymiz — qo'lda/deploy restart keyin yolg'on signal bermasligi uchun.
    const isCrashLoop = p.pm2_env.restart_time >= 8 && upMinutes < 5;

    if (p.pm2_env.status === "errored" || isCrashLoop) {
      alerts.push({
        id: nextId(),
        level: "error",
        text: `${p.name} jarayoni beqaror — ${p.pm2_env.restart_time} marta qayta ishga tushdi`,
        time: "hozir",
        href: "/servers/vps-contabo",
      });
    } else if (p.pm2_env.status !== "online") {
      alerts.push({
        id: nextId(),
        level: "warning",
        text: `${p.name} jarayoni "${p.pm2_env.status}" holatida`,
        time: "hozir",
        href: "/servers/vps-contabo",
      });
    }
  }

  const remoteResults = await Promise.all(connections.map((c) => fetchRemoteServer(c)));
  for (const { server } of remoteResults) {
    if (server.status === "offline") {
      alerts.push({
        id: nextId(),
        level: "error",
        text: `${server.name} (${server.ip}) bilan ulanish yo'q`,
        time: "hozir",
        href: `/servers/${server.id}`,
      });
    }
  }

  for (const d of domains) {
    if (d.ssl === "expiring") {
      alerts.push({
        id: nextId(),
        level: "warning",
        text: `${d.name} SSL sertifikati ${d.daysLeft} kundan keyin tugaydi`,
        time: "hozir",
        href: "/ssl",
      });
    } else if (d.ssl === "none") {
      alerts.push({
        id: nextId(),
        level: "info",
        text: `${d.name} uchun SSL sertifikat yo'q`,
        time: "hozir",
        href: "/domains",
      });
    }
  }

  if (alerts.length === 0) {
    alerts.push({
      id: nextId(),
      level: "success",
      text: "Hammasi normal — ogohlantirish yo'q",
      time: "hozir",
    });
  }

  return alerts;
}
