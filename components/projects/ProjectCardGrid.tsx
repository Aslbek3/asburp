"use client";

import { Bot, Globe2, Plug, Plus, RotateCw, ScrollText, Rocket, Settings } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useProjects } from "@/hooks/useProjects";
import { useProjectStore } from "@/store/projectStore";
import type { ProjectStatus, ProjectType } from "@/lib/types";

const typeMap: Record<ProjectType, { icon: typeof Bot; bg: string; color: string; label: string }> = {
  bot: { icon: Bot, bg: "bg-accent-soft", color: "text-accent", label: "BOT" },
  web: { icon: Globe2, bg: "bg-green-soft", color: "text-green", label: "WEB" },
  api: { icon: Plug, bg: "bg-purple-soft", color: "text-purple", label: "API" },
};

const statusMap: Record<ProjectStatus, { bg: string; color: string; dot: string; label: string }> = {
  running: { bg: "bg-green-soft", color: "text-green", dot: "bg-green", label: "Ishlayapti" },
  stopped: { bg: "bg-bg-3", color: "text-text-2", dot: "bg-text-3", label: "To'xtatilgan" },
  error: { bg: "bg-red-soft", color: "text-red", dot: "bg-red", label: "Xato" },
};

const actions = [
  { icon: RotateCw, title: "Restart" },
  { icon: ScrollText, title: "Logs" },
  { icon: Rocket, title: "Deploy" },
  { icon: Settings, title: "Sozlamalar" },
];

export function ProjectCardGrid() {
  const { data } = useProjects();
  const search = useProjectStore((s) => s.search);
  const typeFilter = useProjectStore((s) => s.typeFilter);

  const filtered = (data ?? []).filter((p) => {
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[14px]">
      {filtered.map((pr) => {
        const tm = typeMap[pr.type];
        const sm = statusMap[pr.status];
        return (
          <Card key={pr.id} padding="p-[15px]">
            <div className="flex items-start justify-between mb-[11px]">
              <div className="flex items-center gap-[10px]">
                <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-none ${tm.bg}`}>
                  <tm.icon size={17} strokeWidth={1.7} className={tm.color} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold font-mono">{pr.name}</div>
                  <div className="text-[10.5px] text-text-3 mt-[2px]">{pr.vps}</div>
                </div>
              </div>
              <span className={`flex items-center gap-[5px] px-2 py-[3px] rounded-full ${sm.bg}`}>
                <span className={`w-[6px] h-[6px] rounded-full ${sm.dot}`} />
                <span className={`text-[10px] font-semibold ${sm.color}`}>{sm.label}</span>
              </span>
            </div>
            <div className="flex gap-[6px] flex-wrap mb-[13px]">
              <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-[6px] ${tm.bg} ${tm.color}`}>
                {tm.label}
              </span>
              {pr.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-text-2 bg-bg-2 border border-border-1 px-2 py-[2px] rounded-[6px]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-[10.5px] text-text-3 mb-[13px]">Oxirgi deploy: {pr.lastDeploy}</div>
            <div className="grid grid-cols-4 gap-[5px] pt-3 border-t border-border-1">
              {actions.map((ac) => (
                <button
                  key={ac.title}
                  type="button"
                  title={ac.title}
                  onClick={() => toast.info(`${pr.name}: ${ac.title}`)}
                  className="flex items-center justify-center h-7 border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2 hover:text-text-1"
                >
                  <ac.icon size={13} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </Card>
        );
      })}

      <button
        type="button"
        onClick={() => toast.info("Yangi loyiha qo'shish oynasi ochiladi")}
        className="flex flex-col items-center justify-center gap-[9px] min-h-[170px] bg-transparent border-[1.5px] border-dashed border-border-2 rounded-xl cursor-pointer text-text-3 hover:border-accent hover:text-accent"
      >
        <div className="w-10 h-10 rounded-full bg-bg-2 flex items-center justify-center">
          <Plus size={20} strokeWidth={1.8} />
        </div>
        <span className="text-[12.5px] font-medium">Yangi loyiha qo&apos;shish</span>
      </button>
    </div>
  );
}
