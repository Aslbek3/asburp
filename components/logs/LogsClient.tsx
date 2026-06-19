"use client";

import { useMemo } from "react";
import { ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useLogLines } from "@/hooks/useMisc";
import { useLogStore } from "@/store/logStore";
import { cn } from "@/lib/utils";
import type { LogLine } from "@/lib/types";

const levelOptions: { value: LogLine["level"] | "all"; label: string; dot: string }[] = [
  { value: "all", label: "Barchasi", dot: "bg-text-3" },
  { value: "error", label: "Error", dot: "bg-red" },
  { value: "warning", label: "Warning", dot: "bg-amber" },
  { value: "info", label: "Info", dot: "bg-accent" },
  { value: "debug", label: "Debug", dot: "bg-text-3" },
];

const levelTextColor: Record<LogLine["level"], string> = {
  error: "text-red",
  warning: "text-amber",
  info: "text-accent",
  debug: "text-text-3",
};

export function LogsClient() {
  const { data } = useLogLines();
  const level = useLogStore((s) => s.level);
  const setLevel = useLogStore((s) => s.setLevel);
  const search = useLogStore((s) => s.search);
  const setSearch = useLogStore((s) => s.setSearch);
  const { filtered, regexError } = useMemo(() => {
    const lines = data ?? [];
    let regex: RegExp | null = null;
    let error = false;
    if (search) {
      try {
        regex = new RegExp(search, "i");
      } catch {
        error = true;
      }
    }
    const result = lines.filter((l) => {
      const matchesLevel = level === "all" || l.level === level;
      const matchesSearch = !regex || regex.test(l.message);
      return matchesLevel && matchesSearch;
    });
    return { filtered: result, regexError: error };
  }, [data, level, search]);

  return (
    <div className="flex flex-col gap-[14px]">
      <Card padding="p-[12px_14px]" className="flex items-center gap-2 flex-wrap">
        <button className="flex items-center gap-2 h-[32px] px-3 border border-border-1 rounded-lg bg-bg-2 text-[12px] font-mono cursor-pointer">
          contabo-de-01
          <ChevronDown size={13} className="text-text-3" />
        </button>
        <button className="flex items-center gap-2 h-[32px] px-3 border border-border-1 rounded-lg bg-bg-2 text-[12px] cursor-pointer">
          Barchasi
          <ChevronDown size={13} className="text-text-3" />
        </button>
        <div className="flex gap-1 bg-bg-2 p-[3px] rounded-[9px] border border-border-1">
          {levelOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLevel(opt.value)}
              className={cn(
                "flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px] text-[11.5px] font-medium cursor-pointer",
                level === opt.value ? "bg-bg-1 text-text-1" : "text-text-2",
              )}
            >
              <span className={cn("w-[6px] h-[6px] rounded-full", opt.dot)} />
              {opt.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Regex qidirish..."
          className={cn(
            "flex-1 min-w-[140px] h-[32px] px-3 border rounded-lg bg-bg-2 text-[12px] outline-none",
            regexError ? "border-red" : "border-border-1",
          )}
        />
        <button
          type="button"
          onClick={() => toast.success("Loglar yuklab olindi")}
          className="flex items-center gap-[6px] h-[32px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
        >
          <Download size={13} strokeWidth={1.8} />
          Yuklab olish
        </button>
      </Card>

      <div className="bg-[#0f1117] border border-border-1 rounded-[11px] p-[14px] font-mono text-[11.5px] leading-[1.8] max-h-[560px] overflow-y-auto">
        {filtered.map((l) => (
          <div key={l.id} className="flex gap-[10px]">
            <span className="text-[#5b6478] flex-none">{l.ts}</span>
            <span
              className={cn(
                "w-[54px] flex-none text-[10px] font-semibold uppercase",
                levelTextColor[l.level],
              )}
            >
              {l.level}
            </span>
            <span className="text-[#e8eaf0]">{l.message}</span>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-[#5b6478]">Mos qatorlar topilmadi.</div>}
      </div>
    </div>
  );
}
