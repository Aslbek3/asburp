import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  trend,
  trendColor,
  value,
  unit,
  pct,
  barColor,
  avg,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  trend: string;
  trendColor: string;
  value: string;
  unit?: string;
  pct: number;
  barColor?: "red" | "amber" | "accent" | "green";
  avg: string;
}) {
  return (
    <Card padding="p-[14px]">
      <div className="flex items-center justify-between mb-[11px]">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-7 h-7 rounded-[8px] flex items-center justify-center", iconBg)}
          >
            <Icon size={15} strokeWidth={1.8} className={iconColor} />
          </div>
          <span className="text-[12px] text-text-2 font-medium">{label}</span>
        </div>
        <span className={cn("text-[11px] font-medium", trendColor)}>{trend}</span>
      </div>
      <div className="flex items-baseline gap-[5px]">
        <span className="text-[23px] font-semibold tracking-[-0.03em]">{value}</span>
        {unit && <span className="text-[11.5px] text-text-3">{unit}</span>}
      </div>
      <ProgressBar pct={pct} color={barColor} className="mt-[11px]" />
      <div className="mt-[7px] text-[10.5px] text-text-3">O&apos;rtacha: {avg}</div>
    </Card>
  );
}
