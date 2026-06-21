"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2, ShieldAlert, Clock, DatabaseBackup, KeyRound, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";

const actions = [
  { label: "Nginx config", icon: Settings2, bg: "bg-accent-soft", color: "text-accent", action: "nginx" as const },
  { label: "Firewall", icon: ShieldAlert, bg: "bg-red-soft", color: "text-red", action: "firewall" as const },
  { label: "Cron jobs", icon: Clock, bg: "bg-amber-soft", color: "text-amber", action: "cron" as const },
  { label: "PM2 saqlash", icon: DatabaseBackup, bg: "bg-green-soft", color: "text-green", action: "pm2-save" as const },
  { label: "SSH kalitlar", icon: KeyRound, bg: "bg-purple-soft", color: "text-purple", action: "ssh-keys" as const },
  { label: "Resurs analiz", icon: BarChart3, bg: "bg-accent-soft", color: "text-accent", action: "navigate" as const },
];

export function QuickActions() {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  const run = async (action: string, label: string) => {
    if (action === "navigate") {
      router.push("/servers/vps-contabo");
      return;
    }
    setPending(action);
    try {
      const res = await fetch("/api/quick-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`${label}: ${data.message}`);
      } else {
        toast.error(`${label}: ${data.message}`);
      }
    } catch {
      toast.error(`${label}: tekshirib bo'lmadi`);
    } finally {
      setPending(null);
    }
  };

  return (
    <Card padding="p-[15px]">
      <div className="text-[13.5px] font-semibold mb-[10px]">Tezkor amallar</div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            disabled={pending === a.action}
            onClick={() => run(a.action, a.label)}
            className="flex items-center gap-[9px] p-[10px] border border-border-1 rounded-[9px] bg-bg-1 cursor-pointer text-left hover:bg-bg-2 hover:border-border-2 disabled:opacity-60"
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
