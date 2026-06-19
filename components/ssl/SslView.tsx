"use client";

import { useState } from "react";
import { Lock, ShieldCheck, RefreshCw } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useSsl } from "@/hooks/useMisc";

export function SslView() {
  const { data } = useSsl();
  const rows = [...(data ?? [])].sort((a, b) => a.daysLeft - b.daysLeft);
  const active = rows.length;
  const expiringSoon = rows.filter((r) => r.daysLeft <= 14).length;
  const autoRenewCount = rows.filter((r) => r.autoRenew).length;
  const [renewMap, setRenewMap] = useState<Record<string, boolean>>({});

  const isAutoRenew = (id: string, fallback: boolean) =>
    renewMap[id] !== undefined ? renewMap[id] : fallback;

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3">
        <Stat icon={ShieldCheck} bg="bg-green-soft" color="text-green" value={`${active}`} label="Faol" />
        <Stat icon={Lock} bg="bg-amber-soft" color="text-amber" value={`${expiringSoon}`} label="Tez tugaydi" />
        <Stat icon={RefreshCw} bg="bg-accent-soft" color="text-accent" value={`${autoRenewCount}`} label="Auto-renewal" />
      </div>

      <Card padding="p-0" className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-[12.5px]">
          <thead>
            <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
              <th className="text-left font-medium px-4 py-3">Domen</th>
              <th className="text-left font-medium px-4 py-3">Beruvchi</th>
              <th className="text-left font-medium px-4 py-3">Tugash sanasi</th>
              <th className="text-left font-medium px-4 py-3">Qolgan muddat</th>
              <th className="text-left font-medium px-4 py-3">Auto-renewal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const renew = isAutoRenew(s.id, s.autoRenew);
              const color = s.daysLeft <= 14 ? "text-red" : s.daysLeft <= 30 ? "text-amber" : "text-green";
              return (
                <tr key={s.id} className="border-b border-border-1 last:border-b-0">
                  <td className="px-4 py-3 font-mono font-medium flex items-center gap-2">
                    <Lock size={14} strokeWidth={1.6} className="text-text-3" />
                    {s.domain}
                  </td>
                  <td className="px-4 py-3 text-text-2">{s.issuer}</td>
                  <td className="px-4 py-3 font-mono text-text-2">{s.expiresAt}</td>
                  <td className={`px-4 py-3 font-medium ${color}`}>{s.daysLeft} kun</td>
                  <td className="px-4 py-3">
                    <Switch.Root
                      checked={renew}
                      onCheckedChange={(v) => {
                        setRenewMap((prev) => ({ ...prev, [s.id]: v }));
                        toast.success(`${s.domain}: auto-renewal ${v ? "yoqildi" : "o'chirildi"}`);
                      }}
                      className="w-9 h-5 rounded-full bg-bg-3 border border-border-1 relative data-[state=checked]:bg-accent cursor-pointer"
                    >
                      <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform translate-x-[3px] will-change-transform data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Stat({
  icon: Icon,
  bg,
  color,
  value,
  label,
}: {
  icon: typeof Lock;
  bg: string;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <Card padding="p-[13px_15px]">
      <div className="flex items-center gap-[11px]">
        <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-none ${bg}`}>
          <Icon size={17} strokeWidth={1.8} className={color} />
        </div>
        <div>
          <div className="text-[20px] font-semibold tracking-[-0.02em] leading-none">{value}</div>
          <div className="text-[11px] text-text-2 mt-1">{label}</div>
        </div>
      </div>
    </Card>
  );
}
