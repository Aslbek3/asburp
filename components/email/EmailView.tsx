"use client";

import { Plus, ExternalLink, Settings } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useEmailAccounts } from "@/hooks/useMisc";

export function EmailView() {
  const { data } = useEmailAccounts();

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 h-[34px] px-3 border border-border-1 rounded-lg bg-bg-2 text-[12px] cursor-pointer">
          navbat.uz
        </button>
        <button
          type="button"
          onClick={() => toast.info("Roundcube webmail ochiladi")}
          className="flex items-center gap-[6px] h-[34px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
        >
          <ExternalLink size={14} strokeWidth={1.8} />
          Webmail (Roundcube)
        </button>
      </div>

      <Card padding="p-0" className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[12.5px]">
          <thead>
            <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
              <th className="text-left font-medium px-4 py-3">Email manzil</th>
              <th className="text-left font-medium px-4 py-3">Xotira</th>
              <th className="text-left font-medium px-4 py-3">Forwarding</th>
              <th className="text-right font-medium px-4 py-3">Amal</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((acc) => {
              const pct = Math.round((acc.usedMb / acc.quotaMb) * 100);
              const color = pct >= 85 ? "red" : pct >= 65 ? "amber" : "green";
              return (
                <tr key={acc.id} className="border-b border-border-1 last:border-b-0">
                  <td className="px-4 py-3 flex items-center gap-[10px]">
                    <span className="w-7 h-7 rounded-full bg-purple-soft text-purple flex items-center justify-center text-[10.5px] font-semibold flex-none">
                      {acc.address.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-mono font-medium">{acc.address}</span>
                  </td>
                  <td className="px-4 py-3 w-[180px]">
                    <div className="flex items-center justify-between text-[11px] text-text-2 mb-1">
                      <span>{(acc.usedMb / 1024).toFixed(1)}GB / {(acc.quotaMb / 1024).toFixed(0)}GB</span>
                    </div>
                    <ProgressBar pct={pct} color={color} />
                  </td>
                  <td className="px-4 py-3 text-text-2">{acc.forwarding}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      title="Sozlash"
                      onClick={() => toast.info(`${acc.address} sozlamalari`)}
                      className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                    >
                      <Settings size={13} strokeWidth={1.8} />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => toast.info("Yangi email account qo'shish")}
                  className="flex items-center gap-2 text-accent text-[12px] font-medium bg-transparent border-none cursor-pointer"
                >
                  <Plus size={14} strokeWidth={1.9} />
                  Yangi account
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
