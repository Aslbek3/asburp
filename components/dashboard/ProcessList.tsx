"use client";

import { useRouter } from "next/navigation";
import { FileText, RotateCw, Square } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { IconButton } from "@/components/shared/IconButton";
import { useProcesses } from "@/hooks/useDashboardData";
import { useLogStore } from "@/store/logStore";
import { toast } from "sonner";
import type { ProcessStatus } from "@/lib/types";

const statusTone: Record<ProcessStatus, { color: string; bg: string; label: string }> = {
  online: { color: "text-green", bg: "bg-green-soft", label: "Online" },
  stopped: { color: "text-text-3", bg: "bg-bg-3", label: "Stopped" },
  errored: { color: "text-red", bg: "bg-red-soft", label: "Errored" },
};

const dotColor: Record<ProcessStatus, string> = {
  online: "bg-green",
  stopped: "bg-text-3",
  errored: "bg-red",
};

export function ProcessList() {
  const router = useRouter();
  const setLogSearch = useLogStore((s) => s.setSearch);
  const { data } = useProcesses();
  const processes = (data ?? []).filter((p) => p.serverId === "contabo-de-01");

  const openLogs = (processName: string) => {
    setLogSearch(processName);
    router.push("/logs");
  };

  return (
    <Card padding="p-[15px]">
      <div className="flex items-center justify-between mb-[6px]">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-semibold">PM2 jarayonlar</span>
          <span className="text-[10.5px] font-medium text-text-2 bg-bg-3 px-[7px] py-[1px] rounded-full">
            {processes.length} ta
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/servers/contabo-de-01")}
          className="text-[11.5px] text-accent font-medium bg-transparent border-none cursor-pointer hover:underline"
        >
          Barchasi →
        </button>
      </div>
      {processes.map((p) => {
        const tone = statusTone[p.status];
        return (
          <div key={p.id} className="flex items-center gap-[11px] py-[9px] border-b border-border-1 last:border-b-0">
            <span className={`w-2 h-2 rounded-full flex-none ${dotColor[p.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium font-mono">{p.name}</div>
              <div className="text-[10.5px] text-text-3 mt-[1px]">
                id {p.pmid} · {p.cpu} CPU · {p.mem} · ↻ {p.restarts}
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
              {tone.label}
            </span>
            <span className="text-[11px] text-text-2 w-[42px] text-right font-mono">{p.uptime}</span>
            <div className="flex gap-[3px]">
              <IconButton icon={FileText} title="Log" onClick={() => openLogs(p.name)} />
              <IconButton
                icon={RotateCw}
                title="Restart"
                hover="accent"
                onClick={() => toast.success(`${p.name} qayta ishga tushirildi`)}
              />
              <IconButton
                icon={Square}
                title="Stop"
                hover="danger"
                onClick={() => toast.info(`${p.name} to'xtatildi`)}
              />
            </div>
          </div>
        );
      })}
    </Card>
  );
}
