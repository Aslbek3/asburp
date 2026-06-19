"use client";

import { Card } from "@/components/shared/Card";
import { useServers } from "@/hooks/useServers";
import { useProcesses } from "@/hooks/useDashboardData";
import { useServerStore } from "@/store/serverStore";
import type { ProcessStatus } from "@/lib/types";

const statusTone: Record<ProcessStatus, { color: string; bg: string; label: string; dot: string }> = {
  online: { color: "text-green", bg: "bg-green-soft", label: "Online", dot: "bg-green" },
  stopped: { color: "text-text-3", bg: "bg-bg-3", label: "Stopped", dot: "bg-text-3" },
  errored: { color: "text-red", bg: "bg-red-soft", label: "Errored", dot: "bg-red" },
};

export function DetailPanel() {
  const { data: servers } = useServers();
  const { data: processes } = useProcesses();
  const selectedServerId = useServerStore((s) => s.selectedServerId);
  const server = (servers ?? []).find((s) => s.id === selectedServerId);
  if (!server) return null;
  const procs = (processes ?? []).filter((p) => p.serverId === server.id);

  const stats = [
    { label: "Uptime", value: server.uptime },
    { label: "Loyiha", value: `${server.projects}` },
    { label: "Tarmoq", value: server.network },
    { label: "Yuklama", value: server.load },
    { label: "Availability", value: server.availability },
    { label: "Disk", value: `${server.disk}%` },
  ];

  return (
    <Card padding="p-4">
      <div className="flex items-center gap-[9px] mb-[14px]">
        <span
          className={`w-2 h-2 rounded-full ${server.status === "online" ? "bg-green" : "bg-red"}`}
        />
        <span className="text-[14px] font-semibold font-mono">{server.name}</span>
        <span className="text-[11px] text-text-3">{server.os}</span>
      </div>
      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-3 mb-4">
        {stats.map((st) => (
          <div key={st.label} className="bg-bg-2 border border-border-1 rounded-[9px] p-[11px_12px]">
            <div className="text-[10px] text-text-3 uppercase tracking-[0.04em]">{st.label}</div>
            <div className="text-[16px] font-semibold mt-[5px] tracking-[-0.02em]">{st.value}</div>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-text-3 uppercase tracking-[0.05em] mb-2">Jarayonlar</div>
      {procs.map((p) => {
        const tone = statusTone[p.status];
        return (
          <div key={p.id} className="flex items-center gap-[11px] py-2 border-b border-border-1 last:border-b-0">
            <span className={`w-[7px] h-[7px] rounded-full flex-none ${tone.dot}`} />
            <span className="flex-1 text-[12px] font-medium font-mono">{p.name}</span>
            <span className="text-[11px] text-text-2">{p.cpu} CPU</span>
            <span className="text-[11px] text-text-2 w-[60px]">{p.mem}</span>
            <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
              {tone.label}
            </span>
          </div>
        );
      })}
    </Card>
  );
}
