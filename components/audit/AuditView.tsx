"use client";

import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { SkeletonRow } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAudit } from "@/hooks/useMisc";
import type { AuditAction } from "@/lib/types";

const actionTone: Record<AuditAction, { bg: string; color: string }> = {
  DEPLOY: { bg: "bg-accent-soft", color: "text-accent" },
  RESTART: { bg: "bg-amber-soft", color: "text-amber" },
  DELETE: { bg: "bg-red-soft", color: "text-red" },
  SSH: { bg: "bg-purple-soft", color: "text-purple" },
  CREATE: { bg: "bg-green-soft", color: "text-green" },
};

export function AuditView() {
  const { data, isLoading } = useAudit();
  const [search, setSearch] = useState("");
  const filtered = (data ?? []).filter(
    (a) =>
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.target.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[10px]">
        <div className="flex-1 flex items-center gap-2 h-[34px] px-[11px] bg-bg-1 border border-border-1 rounded-lg focus-within:border-accent">
          <Search size={14} strokeWidth={2} className="text-text-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Foydalanuvchi yoki obyekt qidirish..."
            className="flex-1 border-none outline-none bg-transparent text-[12.5px] text-text-1"
          />
        </div>
        <button
          type="button"
          onClick={() => toast.info("Filter ochildi")}
          className="flex items-center gap-[6px] h-[34px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
        >
          <Filter size={13} strokeWidth={1.8} />
          Filter
        </button>
        <button
          type="button"
          onClick={() => toast.success("CSV eksport qilindi")}
          className="flex items-center gap-[6px] h-[34px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
        >
          <Download size={13} strokeWidth={1.8} />
          CSV export
        </button>
      </div>

      <Card padding="p-0" className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-[12.5px]">
          <thead>
            <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
              <th className="text-left font-medium px-4 py-3">Foydalanuvchi</th>
              <th className="text-left font-medium px-4 py-3">Amal</th>
              <th className="text-left font-medium px-4 py-3">Obyekt</th>
              <th className="text-left font-medium px-4 py-3">IP</th>
              <th className="text-left font-medium px-4 py-3">Vaqt</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}
            {filtered.map((a) => {
              const tone = actionTone[a.action];
              return (
                <tr key={a.id} className="border-b border-border-1 last:border-b-0">
                  <td className="px-4 py-3 font-medium">{a.user}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
                      {a.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-text-2">{a.target}</td>
                  <td className="px-4 py-3 font-mono text-text-2">{a.ip}</td>
                  <td className="px-4 py-3 text-text-3">{a.time}</td>
                </tr>
              );
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState title="Yozuv topilmadi" description="Qidiruvga mos audit yozuvi yo'q." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
