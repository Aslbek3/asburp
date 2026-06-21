import { NextResponse } from "next/server";
import {
  getCpuUsagePercent,
  getDiskInfo,
  getMemoryInfo,
  getNetworkRateMbps,
} from "@/lib/system-metrics";
import { getCpuTrend } from "@/lib/cpu-sampler";

declare global {
  // eslint-disable-next-line no-var
  var __cpuSmoothed: number | undefined;
}

// Bitta lahzalik o'lchov sachrashi to'g'ridan-to'g'ri UIga chiqib ketmasligi uchun
// exponential moving average bilan silliqlanadi.
function smoothCpu(raw: number): number {
  const prev = globalThis.__cpuSmoothed ?? raw;
  const next = prev + (raw - prev) * 0.4;
  globalThis.__cpuSmoothed = next;
  return Math.round(next);
}

export async function GET() {
  const [rawCpu, ram, disk, networkMbps] = await Promise.all([
    getCpuUsagePercent(),
    Promise.resolve(getMemoryInfo()),
    getDiskInfo(),
    getNetworkRateMbps(),
  ]);

  const cpu = smoothCpu(rawCpu);
  const cpuTrend = getCpuTrend(cpu);

  return NextResponse.json({
    cpu: { pct: cpu, trend: cpuTrend },
    ram,
    disk,
    network: { mbps: networkMbps },
  });
}
