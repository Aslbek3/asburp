"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { useAlerts } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import type { AlertLevel } from "@/lib/types";

const levelMap: Record<AlertLevel, { icon: typeof AlertTriangle; bg: string; color: string }> = {
  error: { icon: AlertCircle, bg: "bg-red-soft", color: "text-red" },
  warning: { icon: AlertTriangle, bg: "bg-amber-soft", color: "text-amber" },
  info: { icon: Info, bg: "bg-accent-soft", color: "text-accent" },
  success: { icon: CheckCircle2, bg: "bg-green-soft", color: "text-green" },
};

export function AlertsFeed() {
  const router = useRouter();
  const { data } = useAlerts();
  const newCount = (data ?? []).filter((a) => a.level === "error" || a.level === "warning").length;

  return (
    <Card padding="p-[15px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13.5px] font-semibold">Ogohlantirishlar</span>
        <span className="text-[10.5px] font-semibold text-red bg-red-soft px-[7px] py-[1px] rounded-full">
          {newCount} yangi
        </span>
      </div>
      {(data ?? []).map((a) => {
        const m = levelMap[a.level];
        const Icon = m.icon;
        return (
          <div
            key={a.id}
            onClick={a.href ? () => router.push(a.href!) : undefined}
            className={cn(
              "flex gap-[10px] py-[9px] border-b border-border-1 last:border-b-0",
              a.href && "cursor-pointer rounded-[7px] hover:bg-bg-2 -mx-[6px] px-[6px]",
            )}
          >
            <div className={`w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-none ${m.bg}`}>
              <Icon size={14} strokeWidth={1.9} className={m.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] leading-[1.4]">{a.text}</div>
              <div className="text-[10.5px] text-text-3 mt-[3px]">{a.time}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
