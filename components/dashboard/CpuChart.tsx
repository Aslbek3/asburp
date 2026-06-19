"use client";

import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/shared/Card";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { useCpuSeries } from "@/hooks/useDashboardData";

type Range = "1h" | "24h" | "7d";

export function CpuChart() {
  const [range, setRange] = useState<Range>("1h");
  const { data } = useCpuSeries(range);
  const points = data ?? [];
  const values = points.map((p) => p.value);
  const now = values.at(-1) ?? 0;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  return (
    <Card padding="p-[15px]">
      <div className="flex items-start justify-between mb-[14px]">
        <div>
          <div className="text-[13.5px] font-semibold">CPU tarixi</div>
          <div className="text-[11px] text-text-3 mt-[2px]">contabo-de-01 · foiz</div>
        </div>
        <SegmentedControl
          options={[
            { value: "1h", label: "1 soat" },
            { value: "24h", label: "24 soat" },
            { value: "7d", label: "7 kun" },
          ]}
          value={range}
          onChange={setRange}
        />
      </div>
      <div className="flex gap-[26px] mb-3">
        <Stat label="Hozir" value={`${now}%`} color="text-text-1" />
        <Stat label="Min" value={`${min}%`} color="text-green" />
        <Stat label="Max" value={`${max}%`} color="text-red" />
        <Stat label="O'rtacha" value={`${avg}%`} color="text-accent" />
      </div>
      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="cpArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-1)" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-1)",
                border: "1px solid var(--border-1)",
                borderRadius: 8,
                fontSize: 11,
              }}
              labelFormatter={() => ""}
              formatter={(v) => [`${v}%`, "CPU"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#cpArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] text-text-3 uppercase tracking-[0.05em]">{label}</div>
      <div className={`text-[15px] font-semibold mt-[2px] ${color}`}>{value}</div>
    </div>
  );
}
