"use client";

import { useState } from "react";
import { Globe, Search, ShieldCheck, Settings, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { SkeletonRow } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useDomains } from "@/hooks/useMisc";
import { useCan } from "@/lib/permissions";

const sslTone: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "bg-green-soft", color: "text-green", label: "Faol" },
  expiring: { bg: "bg-amber-soft", color: "text-amber", label: "Tugaydi" },
  none: { bg: "bg-red-soft", color: "text-red", label: "Yo'q" },
};

export function DomainsTable() {
  const { data, isLoading } = useDomains();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const canManage = useCan("manage");

  const filtered = (data ?? []).filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every((d) => selected.includes(d.id));

  const toggleAll = () => {
    setSelected(allSelected ? [] : filtered.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const renewSelected = () => {
    toast.success(
      selected.length > 0
        ? `${selected.length} ta domen uchun SSL yangilanmoqda`
        : "Barcha SSL sertifikatlari yangilanmoqda",
    );
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[10px]">
        <div className="flex-1 flex items-center gap-2 h-[34px] px-[11px] bg-bg-1 border border-border-1 rounded-lg focus-within:border-accent">
          <Search size={14} strokeWidth={2} className="text-text-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Domen qidirish..."
            className="flex-1 border-none outline-none bg-transparent text-[12.5px] text-text-1"
          />
        </div>
        {canManage && (
          <button
            type="button"
            onClick={renewSelected}
            className="flex items-center gap-[6px] h-[34px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
          >
            <ShieldCheck size={14} strokeWidth={1.8} />
            {selected.length > 0 ? `SSL yangilash (${selected.length})` : "Bulk SSL yangilash"}
          </button>
        )}
      </div>

      <Card padding="p-0" className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-[12.5px]">
          <thead>
            <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
              {canManage && (
                <th className="px-4 py-3 w-[34px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Barchasini tanlash"
                    className="w-[14px] h-[14px] cursor-pointer accent-accent"
                  />
                </th>
              )}
              <th className="text-left font-medium px-4 py-3">Domen</th>
              <th className="text-left font-medium px-4 py-3">IP</th>
              <th className="text-left font-medium px-4 py-3">SSL</th>
              <th className="text-left font-medium px-4 py-3">Qoldi kun</th>
              <th className="text-left font-medium px-4 py-3">Nginx</th>
              <th className="text-right font-medium px-4 py-3">Amal</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={canManage ? 7 : 6} />)}
            {filtered.map((d) => {
              const tone = sslTone[d.ssl];
              return (
                <tr key={d.id} className="border-b border-border-1 last:border-b-0">
                  {canManage && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        onChange={() => toggleOne(d.id)}
                        aria-label={`${d.name} tanlash`}
                        className="w-[14px] h-[14px] cursor-pointer accent-accent"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 font-mono font-medium flex items-center gap-2">
                    <Globe size={14} strokeWidth={1.6} className="text-text-3" />
                    {d.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-text-2">{d.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
                      {tone.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={d.daysLeft <= 14 ? "text-red" : d.daysLeft <= 30 ? "text-amber" : "text-text-2"}>
                      {d.daysLeft > 0 ? `${d.daysLeft} kun` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-[6px] text-text-2">
                      <span className={`w-[6px] h-[6px] rounded-full ${d.nginx === "active" ? "bg-green" : "bg-text-3"}`} />
                      {d.nginx === "active" ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage && (
                      <button
                        type="button"
                        title="Sozlash"
                        onClick={() => toast.info(`${d.name} sozlamalari`)}
                        className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                      >
                        <Settings size={13} strokeWidth={1.8} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={canManage ? 7 : 6}>
                  <EmptyState title="Domen topilmadi" description="Qidiruvga mos domen yo'q." />
                </td>
              </tr>
            )}
            {canManage && (
              <tr>
                <td colSpan={7} className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toast.info("Yangi domen qo'shish (A record + Nginx + SSL)")}
                    className="flex items-center gap-2 text-accent text-[12px] font-medium bg-transparent border-none cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={1.9} />
                    Yangi domen qo&apos;shish (A record + Nginx + SSL)
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
