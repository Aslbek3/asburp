import { NextResponse } from "next/server";
import type { ServerRow } from "@/lib/types";
import {
  VPS_CONTABO_ID,
  VPS_CONTABO_NAME,
  getCpuUsagePercent,
  getDiskUsagePercent,
  getLoadAvgString,
  getMemoryUsagePercent,
  getNetworkRate,
  getOsName,
  getPublicIp,
  getPm2Processes,
  getUptimeString,
} from "@/lib/system-metrics";
import { listConnections } from "@/lib/vps-store";
import { fetchRemoteServer } from "@/lib/remote-metrics";

export async function GET() {
  const [cpu, ram, disk, os, ip, network, processes, connections] = await Promise.all([
    getCpuUsagePercent(),
    Promise.resolve(getMemoryUsagePercent()),
    getDiskUsagePercent(),
    getOsName(),
    getPublicIp(),
    getNetworkRate(),
    getPm2Processes(),
    listConnections(),
  ]);

  const onlineProjects = processes.filter((p) => p.pm2_env.status === "online").length;

  const localServer: ServerRow = {
    id: VPS_CONTABO_ID,
    name: VPS_CONTABO_NAME,
    ip,
    location: "—",
    os,
    status: "online",
    tags: ["Production", "PM2", "Nginx"],
    cpu,
    ram,
    disk,
    projects: onlineProjects,
    uptime: getUptimeString(),
    uptimePct: "100%",
    network,
    availability: "100%",
    load: getLoadAvgString(),
  };

  const remoteResults = await Promise.all(connections.map((c) => fetchRemoteServer(c)));
  const remoteServers = remoteResults.map((r) => r.server);

  return NextResponse.json([localServer, ...remoteServers]);
}
