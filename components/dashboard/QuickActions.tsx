"use client";

import { Settings2, ShieldAlert, Clock, DatabaseBackup, KeyRound, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";

const actions = [
  { label: "Nginx config", icon: Settings2, bg: "bg-accent-soft", color: "text-accent" },
  { label: "Firewall", icon: ShieldAlert, bg: "bg-red-soft", color: "text-red" },
  { label: "Cron jobs", icon: Clock, bg: "bg-amber-soft", color: "text-amber" },
  { label: "DB backup", icon: DatabaseBackup, bg: "bg-green-soft", color: "text-green" },
  { label: "SSH kalitlar", icon: KeyRound, bg: "bg-purple-soft", color: "text-purple" },
  { label: "Resurs analiz", icon: BarChart3, bg: "bg-accent-soft", color: "text-accent" },
];

export function QuickActions() {
  return (
    <Card padding="p-[15px]">
      <div className="text-[13.5px] font-semibold mb-[10px]">Tezkor amallar</div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => toast.info(`${a.label} ochildi`)}
            className="flex items-center gap-[9px] p-[10px] border border-border-1 rounded-[9px] bg-bg-1 cursor-pointer text-left hover:bg-bg-2 hover:border-border-2"
          >
            <div className={`w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-none ${a.bg}`}>
              <a.icon size={14} strokeWidth={1.8} className={a.color} />
            </div>
            <span className="text-[11.5px] font-medium text-text-1">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
