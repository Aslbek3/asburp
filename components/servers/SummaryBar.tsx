"use client";

import { Server, Box, AlertTriangle, Globe } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { useServers } from "@/hooks/useServers";
import { useProjects } from "@/hooks/useProjects";
import { useDomains } from "@/hooks/useMisc";

export function SummaryBar() {
  const { data: servers } = useServers();
  const { data: projects } = useProjects();
  const { data: domains } = useDomains();
  const online = (servers ?? []).filter((s) => s.status === "online").length;
  const total = (servers ?? []).length;

  const items = [
    { icon: Server, bg: "bg-green-soft", color: "text-green", value: `${online}/${total}`, label: "Online" },
    { icon: Box, bg: "bg-accent-soft", color: "text-accent", value: `${(projects ?? []).length}`, label: "Jami loyiha" },
    { icon: AlertTriangle, bg: "bg-amber-soft", color: "text-amber", value: "3", label: "Ogohlantirish" },
    { icon: Globe, bg: "bg-purple-soft", color: "text-purple", value: `${(domains ?? []).length}`, label: "Domen" },
  ];

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-3">
      {items.map((it) => (
        <Card key={it.label} padding="p-[13px_15px]">
          <div className="flex items-center gap-[11px]">
            <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-none ${it.bg}`}>
              <it.icon size={17} strokeWidth={1.8} className={it.color} />
            </div>
            <div>
              <div className="text-[20px] font-semibold tracking-[-0.02em] leading-none">{it.value}</div>
              <div className="text-[11px] text-text-2 mt-1">{it.label}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
