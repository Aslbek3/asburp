"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { deployLog as deployLogMock, deployHistory } from "@/lib/mock-data";
import type { DeployPipelineStep, DeployResult, LogLine } from "@/lib/types";

const initialPipeline: DeployPipelineStep[] = [
  { id: "pl1", label: "Git pull", status: "done" },
  { id: "pl2", label: "Install", status: "done" },
  { id: "pl3", label: "Build", status: "done" },
  { id: "pl4", label: "Restart", status: "done" },
];

const resultTone: Record<DeployResult, { bg: string; color: string; dot: string; label: string }> = {
  success: { bg: "bg-green-soft", color: "text-green", dot: "bg-green", label: "Muvaffaqiyat" },
  failed: { bg: "bg-red-soft", color: "text-red", dot: "bg-red", label: "Xato" },
  running: { bg: "bg-accent-soft", color: "text-accent", dot: "bg-accent", label: "Jarayonda" },
};

const lineColor: Record<LogLine["level"], string> = {
  info: "text-[#e8eaf0]",
  warning: "text-[#f5a623]",
  error: "text-[#e85d75]",
  debug: "text-[#5b6478]",
};

export function DeployClient() {
  const [pipeline, setPipeline] = useState<DeployPipelineStep[]>(initialPipeline);
  const [log, setLog] = useState<LogLine[]>(deployLogMock);
  const [running, setRunning] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const runDeploy = () => {
    if (running) return;
    setRunning(true);
    setLog([]);
    const steps: DeployPipelineStep["id"][] = ["pl1", "pl2", "pl3", "pl4"];
    setPipeline(steps.map((id, i) => ({ id, label: initialPipeline[i].label, status: i === 0 ? "active" : "pending" })));

    let i = 0;
    const lines = deployLogMock;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setLog((prev) => [...prev, lines[i]]);
        const stepIdx = Math.min(3, Math.floor((i / lines.length) * 4));
        setPipeline((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < stepIdx ? "done" : idx === stepIdx ? "active" : "pending",
          })),
        );
        i++;
      } else {
        clearInterval(interval);
        setPipeline((prev) => prev.map((s) => ({ ...s, status: "done" })));
        setRunning(false);
        toast.success("navbat-web muvaffaqiyatli deploy qilindi");
      }
    }, 350);
  };

  return (
    <div className="grid grid-cols-1 desktop:grid-cols-[1fr_350px] gap-[14px] items-start">
      <div className="flex flex-col gap-[14px] min-w-0">
        <Card padding="p-[14px]" className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <div className="text-[10.5px] text-text-3 uppercase tracking-[0.05em] mb-[6px]">Loyiha</div>
            <button className="w-full flex items-center justify-between h-[34px] px-[11px] border border-border-1 rounded-lg bg-bg-2 text-text-1 text-[12.5px] font-medium cursor-pointer font-mono">
              <span>navbat-web</span>
              <ChevronDown size={13} className="text-text-3" />
            </button>
          </div>
          <div className="flex-1 min-w-[140px]">
            <div className="text-[10.5px] text-text-3 uppercase tracking-[0.05em] mb-[6px]">Branch</div>
            <button className="w-full flex items-center justify-between h-[34px] px-[11px] border border-border-1 rounded-lg bg-bg-2 text-text-1 text-[12.5px] font-medium cursor-pointer font-mono">
              <span>main</span>
              <ChevronDown size={13} className="text-text-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={runDeploy}
            disabled={running}
            className="flex items-center gap-[7px] h-[34px] px-4 border border-accent rounded-lg bg-accent text-white text-[12.5px] font-medium cursor-pointer disabled:opacity-60"
          >
            <ArrowUp size={14} strokeWidth={1.9} />
            <span>{running ? "Deploy qilinmoqda..." : "Deploy"}</span>
          </button>
        </Card>

        <Card padding="p-[18px_15px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13.5px] font-semibold">Pipeline · navbat-web</span>
            <span className="text-[11px] text-text-3 font-mono">#284 · 2m 14s</span>
          </div>
          <div className="flex items-center">
            {pipeline.map((st, idx) => {
              const tone =
                st.status === "done"
                  ? { bg: "bg-green-soft", color: "var(--green)" }
                  : st.status === "active"
                    ? { bg: "bg-accent-soft", color: "var(--accent)" }
                    : { bg: "bg-bg-2", color: "var(--text-3)" };
              return (
                <div key={st.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-2 flex-none">
                    <div
                      className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border-[1.5px] ${tone.bg}`}
                      style={{ borderColor: tone.color }}
                    >
                      <span className="text-[13px] font-semibold" style={{ color: tone.color }}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-[11.5px] font-medium">{st.label}</div>
                      <div className="text-[10px] mt-[1px]" style={{ color: tone.color }}>
                        {st.status === "done" ? "Tugadi" : st.status === "active" ? "Jarayonda" : "Kutmoqda"}
                      </div>
                    </div>
                  </div>
                  {idx < pipeline.length - 1 && (
                    <div
                      className="flex-1 h-[1.5px] mx-[6px] mb-[30px]"
                      style={{ background: st.status === "done" ? "var(--green)" : "var(--border-2)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="bg-[#0f1117] border border-border-1 rounded-[11px] overflow-hidden">
          <div className="flex items-center justify-between px-[14px] py-[11px] border-b border-[#2a2d36]">
            <div className="flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-[#3ecf8e] cp-pulse" />
              <span className="text-[11.5px] font-medium text-[#e8eaf0]">Jonli log</span>
            </div>
            <span className="text-[10.5px] text-[#5b6478] font-mono">build #284</span>
          </div>
          <div ref={logRef} className="p-[14px] font-mono text-[11.5px] leading-[1.7] max-h-[260px] overflow-y-auto">
            {log.map((l) => (
              <div key={l.id} className="flex gap-[10px]">
                <span className="text-[#5b6478] flex-none">{l.ts}</span>
                <span className={`whitespace-pre-wrap ${lineColor[l.level]}`}>{l.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card padding="p-[15px]">
        <div className="text-[13.5px] font-semibold mb-[10px]">Deploy tarixi</div>
        {deployHistory.map((h) => {
          const tone = resultTone[h.result];
          return (
            <div key={h.id} className="flex items-center gap-[10px] py-[11px] border-b border-border-1 last:border-b-0">
              <div className={`w-[7px] h-[7px] rounded-full flex-none ${tone.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium font-mono">
                  {h.project} <span className="text-text-3 font-normal font-sans">· {h.branch}</span>
                </div>
                <div className="text-[10.5px] text-text-3 mt-[2px]">{h.who} · {h.time}</div>
              </div>
              {h.canRollback && (
                <button
                  type="button"
                  title="Rollback"
                  onClick={() => toast.info(`${h.project} oldingi versiyaga qaytarildi`)}
                  className="w-[26px] h-[26px] flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                >
                  <RotateCcw size={13} strokeWidth={1.8} />
                </button>
              )}
            </div>
          );
        })}
        <div className="mt-3 p-[11px] bg-bg-2 border border-border-1 rounded-[9px]">
          <div className="text-[10.5px] text-text-3 uppercase tracking-[0.05em] mb-[6px]">Webhook URL</div>
          <div className="text-[11px] font-mono text-text-2 break-all">
            https://corepanel.uz/api/webhooks/navbat-web
          </div>
        </div>
      </Card>
    </div>
  );
}
