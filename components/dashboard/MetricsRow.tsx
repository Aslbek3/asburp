"use client";

import { Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

const metrics = [
  {
    icon: Cpu,
    iconBg: "bg-accent-soft",
    iconColor: "text-accent",
    label: "CPU",
    trend: "↑ 3%",
    trendColor: "text-green",
    value: "42",
    unit: "%",
    pct: 42,
    barColor: "accent" as const,
    avg: "38%",
  },
  {
    icon: MemoryStick,
    iconBg: "bg-purple-soft",
    iconColor: "text-purple",
    label: "RAM",
    trend: "→",
    trendColor: "text-text-3",
    value: "9.8",
    unit: "/ 16GB",
    pct: 61,
    barColor: "accent" as const,
    avg: "8.9GB",
  },
  {
    icon: HardDrive,
    iconBg: "bg-amber-soft",
    iconColor: "text-amber",
    label: "Disk",
    trend: "↑ 1%",
    trendColor: "text-amber",
    value: "152",
    unit: "/ 400GB",
    pct: 38,
    barColor: "amber" as const,
    avg: "148GB",
  },
  {
    icon: Activity,
    iconBg: "bg-green-soft",
    iconColor: "text-green",
    label: "Tarmoq",
    trend: "↓ 2%",
    trendColor: "text-red",
    value: "24.6",
    unit: "MB/s",
    pct: 24,
    barColor: "green" as const,
    avg: "19.2 MB/s",
  },
];

export function MetricsRow() {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
