import { NextResponse } from "next/server";
import type { ProcessRow } from "@/lib/types";
import { VPS_CONTABO_ID, formatProcessUptime, getPm2Processes } from "@/lib/system-metrics";
import { listConnections } from "@/lib/vps-store";
import { fetchRemoteServer } from "@/lib/remote-metrics";

export async function GET() {
  const [raw, connections] = await Promise.all([getPm2Processes(), listConnections()]);

  const localProcesses: ProcessRow[] = raw.map((p) => ({
    id: `p${p.pm_id}`,
    pmid: p.pm_id,
    name: p.name,
    serverId: VPS_CONTABO_ID,
    cpu: `${p.monit.cpu}%`,
    mem: `${Math.round(p.monit.memory / (1024 * 1024))}mb`,
    restarts: p.pm2_env.restart_time,
    status: p.pm2_env.status === "online" ? "online" : p.pm2_env.status === "stopped" ? "stopped" : "errored",
    uptime: formatProcessUptime(p.pm2_env.pm_uptime, p.pm2_env.status),
  }));

  const remoteResults = await Promise.all(connections.map((c) => fetchRemoteServer(c)));
  const remoteProcesses = remoteResults.flatMap((r) => r.processes);

  return NextResponse.json([...localProcesses, ...remoteProcesses]);
}
