import type { CpuPoint } from "./types";
import { getCpuUsagePercent } from "./system-metrics";

const SAMPLE_INTERVAL_MS = 60_000;
const MAX_SAMPLES = 7 * 24 * 60;

interface Sample {
  ts: number;
  value: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __cpuSamples: Sample[] | undefined;
  // eslint-disable-next-line no-var
  var __cpuSamplerStarted: boolean | undefined;
}

const samples: Sample[] = globalThis.__cpuSamples ?? (globalThis.__cpuSamples = []);

if (!globalThis.__cpuSamplerStarted) {
  globalThis.__cpuSamplerStarted = true;
  const tick = async () => {
    const value = await getCpuUsagePercent();
    samples.push({ ts: Date.now(), value });
    if (samples.length > MAX_SAMPLES) samples.shift();
  };
  tick();
  setInterval(tick, SAMPLE_INTERVAL_MS);
}

function downsample(slice: Sample[], targetPoints: number): CpuPoint[] {
  if (slice.length === 0) return [];
  if (slice.length <= targetPoints) {
    return slice.map((s) => ({ t: formatTime(s.ts), value: s.value }));
  }
  const chunkSize = slice.length / targetPoints;
  const out: CpuPoint[] = [];
  for (let i = 0; i < targetPoints; i++) {
    const chunk = slice.slice(Math.floor(i * chunkSize), Math.floor((i + 1) * chunkSize));
    if (chunk.length === 0) continue;
    const avg = Math.round(chunk.reduce((sum, s) => sum + s.value, 0) / chunk.length);
    out.push({ t: formatTime(chunk.at(-1)!.ts), value: avg });
  }
  return out;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

export function getCpuSeries(range: "1h" | "24h" | "7d"): CpuPoint[] {
  const now = Date.now();
  const windowMs = range === "1h" ? 60 * 60_000 : range === "24h" ? 24 * 60 * 60_000 : 7 * 24 * 60 * 60_000;
  const targetPoints = range === "1h" ? 12 : range === "24h" ? 24 : 28;
  const slice = samples.filter((s) => s.ts >= now - windowMs);
  return downsample(slice, targetPoints);
}

export function getCpuTrend(currentValue: number): number | null {
  const fiveMinAgo = Date.now() - 5 * 60_000;
  const past = samples.find((s) => s.ts >= fiveMinAgo);
  if (!past) return null;
  return currentValue - past.value;
}
