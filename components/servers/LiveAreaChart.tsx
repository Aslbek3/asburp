"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis } from "recharts";

export function LiveAreaChart({
  color,
  base,
  variance,
}: {
  color: string;
  base: number;
  variance: number;
}) {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      t: i,
      value: Math.max(2, Math.min(98, Math.round(base + Math.sin(i / 3) * variance))),
    })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const next = prev.slice(1);
        const last = prev.at(-1)?.value ?? base;
        const value = Math.max(
          2,
          Math.min(98, Math.round(last + (Math.random() - 0.5) * variance)),
        );
        next.push({ t: (prev.at(-1)?.t ?? 0) + 1, value });
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [base, variance]);

  const gradientId = `grad-${color.replace(/[^a-zA-Z]/g, "")}`;

  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={[0, 100]} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
