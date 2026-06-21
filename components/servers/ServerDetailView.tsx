"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, RotateCw, Square } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { IconButton } from "@/components/shared/IconButton";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { LiveAreaChart } from "./LiveAreaChart";
import { useServers } from "@/hooks/useServers";
import { useProcesses } from "@/hooks/useDashboardData";
import { useCan } from "@/lib/permissions";
import { useLogStore } from "@/store/logStore";
import { toast } from "sonner";
import type { ProcessStatus } from "@/lib/types";

const statusTone: Record<ProcessStatus, { color: string; bg: string; label: string; dot: string }> = {
  online: { color: "text-green", bg: "bg-green-soft", label: "Online", dot: "bg-green" },
  stopped: { color: "text-text-3", bg: "bg-bg-3", label: "Stopped", dot: "bg-text-3" },
  errored: { color: "text-red", bg: "bg-red-soft", label: "Errored", dot: "bg-red" },
};

const diskFolders = [
  { label: "/var/www", pct: 44 },
  { label: "/var/log", pct: 18 },
  { label: "/home", pct: 12 },
  { label: "/system", pct: 26 },
];

export function ServerDetailView({ id }: { id: string }) {
  const router = useRouter();
  const setLogSearch = useLogStore((s) => s.setSearch);
  const { data: servers } = useServers();
  const { data: processes } = useProcesses();
  const server = (servers ?? []).find((s) => s.id === id);
  const procs = (processes ?? []).filter((p) => p.serverId === id);
  const [cursorOn, setCursorOn] = useState(true);
  const canManage = useCan("manage");

  const openLogs = (processName: string) => {
    setLogSearch(processName);
    router.push("/logs");
  };

  useEffect(() => {
    const t = setInterval(() => setCursorOn((c) => !c), 600);
    return () => clearInterval(t);
  }, []);

  if (!server) {
    return <div className="text-text-3 text-[13px]">Server topilmadi.</div>;
  }

  const stats = [
    { label: "Uptime", value: server.uptime },
    { label: "Yuklama", value: server.load },
    { label: "Jarayon", value: `${procs.length}` },
    { label: "Tarmoq ↓/↑", value: server.network },
    { label: "Availability", value: server.availability },
    { label: "Disk", value: `${server.disk}%` },
  ];

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-3">
        <span
          className={`text-[10.5px] font-semibold px-2 py-[2px] rounded-full ${
            server.status === "online" ? "bg-green-soft text-green" : "bg-red-soft text-red"
          }`}
        >
          {server.status === "online" ? "Online" : "Offline"}
        </span>
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-3">
        {stats.map((st) => (
          <Card key={st.label} padding="p-[11px_12px]">
            <div className="text-[10px] text-text-3 uppercase tracking-[0.04em]">{st.label}</div>
            <div className="text-[16px] font-semibold mt-[5px] tracking-[-0.02em]">{st.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-[14px]">
        <Card>
          <div className="text-[13px] font-semibold mb-2">CPU (live)</div>
          <LiveAreaChart color="var(--accent)" base={server.cpu} variance={12} />
        </Card>
        <Card>
          <div className="text-[13px] font-semibold mb-2">RAM (live)</div>
          <LiveAreaChart color="var(--purple)" base={server.ram} variance={8} />
        </Card>
      </div>

      <Card>
        <div className="text-[13.5px] font-semibold mb-3">Process manager (PM2)</div>
        {procs.map((p) => {
          const tone = statusTone[p.status];
          return (
            <div key={p.id} className="flex items-center gap-[11px] py-[9px] border-b border-border-1 last:border-b-0">
              <span className={`w-2 h-2 rounded-full flex-none ${tone.dot}`} />
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
                {canManage && (
                  <>
                    <IconButton icon={RotateCw} title="Restart" hover="accent" onClick={() => toast.success(`${p.name} qayta ishga tushirildi`)} />
                    <IconButton icon={Square} title="Stop" hover="danger" onClick={() => toast.info(`${p.name} to'xtatildi`)} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <Card>
        <div className="text-[13.5px] font-semibold mb-3">Disk taqsimoti</div>
        <div className="flex flex-col gap-3">
          {diskFolders.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between mb-[5px]">
                <span className="text-[11.5px] text-text-2 font-mono">{f.label}</span>
                <span className="text-[11px] text-text-3">{f.pct}%</span>
              </div>
              <ProgressBar pct={f.pct} />
            </div>
          ))}
        </div>
      </Card>

      <div className="bg-[#0f1117] border border-border-1 rounded-[11px] overflow-hidden">
        <div className="flex items-center gap-2 px-[14px] py-[11px] border-b border-[#2a2d36]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#3ecf8e] cp-pulse" />
          <span className="text-[11.5px] font-medium text-[#e8eaf0]">Web terminal</span>
        </div>
        <div className="p-[14px] font-mono text-[11.5px] leading-[1.7] text-[#9098a8] min-h-[140px]">
          <div>
            <span className="text-[#3ecf8e]">root@{server.name}</span>:~$ pm2 status
          </div>
          <div className="text-[#5b6478]">┌────┬──────────────────┬─────────┬─────────┐</div>
          <div className="text-[#5b6478]">│ id │ name             │ cpu     │ status  │</div>
          <div className="text-[#5b6478]">└────┴──────────────────┴─────────┴─────────┘</div>
          <div>
            <span className="text-[#3ecf8e]">root@{server.name}</span>:~${" "}
            <span className={cursorOn ? "bg-[#9098a8]" : ""}>&nbsp;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
