"use client";

import { Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { useMetrics } from "@/hooks/useDashboardData";

function trendLabel(delta: number | null): { trend: string; trendColor: string } {
  if (delta === null || Math.abs(delta) < 1) return { trend: "→", trendColor: "text-text-3" };
  if (delta > 0) return { trend: `↑ ${delta}%`, trendColor: "text-amber" };
  return { trend: `↓ ${Math.abs(delta)}%`, trendColor: "text-green" };
}

export function MetricsRow() {
  const { data } = useMetrics();

  const cpuPct = data?.cpu.pct ?? 0;
  const ramPct = data?.ram.pct ?? 0;
  const diskPct = data?.disk.pct ?? 0;
  const networkMbps = data?.network.mbps ?? 0;
  const cpuTrend = trendLabel(data?.cpu.trend ?? null);

  const metrics = [
    {
      icon: Cpu,
      iconBg: "bg-accent-soft",
      iconColor: "text-accent",
      label: "CPU",
      trend: cpuTrend.trend,
      trendColor: cpuTrend.trendColor,
      value: `${cpuPct}`,
      unit: "%",
      pct: cpuPct,
      barColor: "accent" as const,
      avg: `${cpuPct}%`,
    },
    {
      icon: MemoryStick,
      iconBg: "bg-purple-soft",
      iconColor: "text-purple",
      label: "RAM",
      trend: "→",
      trendColor: "text-text-3",
      value: `${data?.ram.usedGb ?? 0}`,
      unit: `/ ${data?.ram.totalGb ?? 0}GB`,
      pct: ramPct,
      barColor: "accent" as const,
      avg: `${data?.ram.usedGb ?? 0}GB`,
    },
    {
      icon: HardDrive,
      iconBg: "bg-amber-soft",
      iconColor: "text-amber",
      label: "Disk",
      trend: "→",
      trendColor: "text-text-3",
      value: `${data?.disk.usedGb ?? 0}`,
      unit: `/ ${data?.disk.totalGb ?? 0}GB`,
      pct: diskPct,
      barColor: "amber" as const,
      avg: `${data?.disk.usedGb ?? 0}GB`,
    },
    {
      icon: Activity,
      iconBg: "bg-green-soft",
      iconColor: "text-green",
      label: "Tarmoq",
      trend: "→",
      trendColor: "text-text-3",
      value: `${networkMbps}`,
      unit: "MB/s",
      pct: Math.min(100, Math.round(networkMbps * 10)),
      barColor: "green" as const,
      avg: `${networkMbps} MB/s`,
    },
  ];

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
