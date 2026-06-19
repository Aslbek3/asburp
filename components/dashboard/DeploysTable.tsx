"use client";

import { Card } from "@/components/shared/Card";
import { useDeploys } from "@/hooks/useDashboardData";
import type { DeployResult } from "@/lib/types";

const resultTone: Record<DeployResult, { bg: string; color: string; label: string }> = {
  success: { bg: "bg-green-soft", color: "text-green", label: "Muvaffaqiyat" },
  failed: { bg: "bg-red-soft", color: "text-red", label: "Xato" },
  running: { bg: "bg-accent-soft", color: "text-accent", label: "Jarayonda" },
};

export function DeploysTable() {
  const { data } = useDeploys();

  return (
    <Card padding="p-[15px]">
      <div className="text-[13.5px] font-semibold mb-[10px]">So'nggi deploylar</div>
      <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_1fr_0.9fr] gap-2 text-[10px] text-text-3 uppercase tracking-[0.05em] pb-2 border-b border-border-1">
        <span>Loyiha</span>
        <span>Branch</span>
        <span>Natija</span>
        <span>Kim</span>
        <span className="text-right">Vaqt</span>
      </div>
      {(data ?? []).map((d) => {
        const tone = resultTone[d.result];
        return (
          <div
            key={d.id}
            className="grid grid-cols-[1.4fr_0.8fr_0.7fr_1fr_0.9fr] gap-2 items-center py-[9px] border-b border-border-1 last:border-b-0 text-[12px]"
          >
            <span className="font-medium font-mono">{d.project}</span>
            <span className="text-text-2 font-mono text-[11px]">{d.branch}</span>
            <span>
              <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
                {tone.label}
              </span>
            </span>
            <span className="text-text-2">{d.who}</span>
            <span className="text-right text-text-3 text-[11px]">{d.time}</span>
          </div>
        );
      })}
    </Card>
  );
}
