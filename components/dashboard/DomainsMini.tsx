"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { useDomainsMini } from "@/hooks/useDashboardData";

const sslTone: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "bg-green-soft", color: "text-green", label: "Faol" },
  expiring: { bg: "bg-amber-soft", color: "text-amber", label: "Tugaydi" },
  none: { bg: "bg-red-soft", color: "text-red", label: "Yo'q" },
};

export function DomainsMini() {
  const router = useRouter();
  const { data } = useDomainsMini();

  return (
    <Card padding="p-[15px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13.5px] font-semibold">Domenlar</span>
        <button
          type="button"
          onClick={() => router.push("/domains")}
          className="text-[11.5px] text-accent font-medium bg-transparent border-none cursor-pointer hover:underline"
        >
          Barchasi →
        </button>
      </div>
      {(data ?? []).map((dm) => {
        const tone = sslTone[dm.ssl];
        return (
          <div key={dm.id} className="flex items-center gap-[10px] py-[9px] border-b border-border-1 last:border-b-0">
            <Globe size={15} strokeWidth={1.6} className="text-text-3 flex-none" />
            <span className="flex-1 text-[12.5px] font-medium font-mono">{dm.name}</span>
            <span className="text-[10.5px] text-text-3">{dm.daysLeft > 0 ? `${dm.daysLeft}d` : "—"}</span>
            <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
              {tone.label}
            </span>
          </div>
        );
      })}
    </Card>
  );
}
