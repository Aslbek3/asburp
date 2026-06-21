"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Server as ServerIcon, Plus, ScrollText, RotateCw, Square } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { ProgressBar, colorForPct } from "@/components/shared/ProgressBar";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddServerModal } from "./AddServerModal";

const textColorClass: Record<"red" | "amber" | "accent" | "green", string> = {
  red: "text-red",
  amber: "text-amber",
  accent: "text-accent",
  green: "text-green",
};
import { IconButton } from "@/components/shared/IconButton";
import { useServers } from "@/hooks/useServers";
import { useServerStore } from "@/store/serverStore";
import { useCan } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function ServerCardGrid() {
  const { data, isLoading } = useServers();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const canManage = useCan("manage");
  const search = useServerStore((s) => s.search);
  const statusFilter = useServerStore((s) => s.statusFilter);
  const selectedServerId = useServerStore((s) => s.selectedServerId);
  const setSelectedServerId = useServerStore((s) => s.setSelectedServerId);

  const filtered = (data ?? []).filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ip.includes(search);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2 gap-[14px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="p-4">
            <div className="flex items-center gap-[11px] mb-[14px]">
              <Skeleton className="w-9 h-9 rounded-[9px]" />
              <div className="flex-1">
                <Skeleton className="h-4 w-28 mb-[6px]" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return <EmptyState title="Server topilmadi" description="Qidiruv yoki filtr shartlariga mos server yo'q." />;
  }

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2 gap-[14px]">
      {filtered.map((sv) => {
        const isSelected = sv.id === selectedServerId;
        const isOffline = sv.status === "offline";
        return (
          <Card
            key={sv.id}
            padding="p-4"
            className={cn(
              "cursor-pointer",
              isSelected ? "border-accent" : "",
              isOffline && "opacity-65",
            )}
          >
            <div onClick={() => setSelectedServerId(sv.id)}>
              <div className="flex items-start justify-between mb-[14px]">
                <div className="flex items-center gap-[11px]">
                  <div className="w-9 h-9 rounded-[9px] bg-bg-3 flex items-center justify-center flex-none">
                    <ServerIcon size={19} strokeWidth={1.6} className="text-text-2" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold font-mono">{sv.name}</div>
                    <div className="text-[11px] text-text-3 mt-[2px]">
                      {sv.ip} · {sv.location}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-[6px] px-[9px] py-1 rounded-full",
                    sv.status === "online" ? "bg-green-soft" : "bg-red-soft",
                  )}
                >
                  <span
                    className={cn(
                      "w-[6px] h-[6px] rounded-full",
                      sv.status === "online" ? "bg-green cp-pulse" : "bg-red",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10.5px] font-semibold",
                      sv.status === "online" ? "text-green" : "text-red",
                    )}
                  >
                    {sv.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="flex gap-[6px] flex-wrap mb-[14px]">
                {sv.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10.5px] text-text-2 bg-bg-2 border border-border-1 px-[9px] py-[2px] rounded-[6px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-[13px] mb-[14px]">
                {[
                  { label: "CPU", val: sv.cpu },
                  { label: "RAM", val: sv.ram },
                  { label: "Disk", val: sv.disk },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-[5px]">
                      <span className="text-[10.5px] text-text-3">{bar.label}</span>
                      <span
                        className={cn(
                          "text-[10.5px] font-semibold",
                          textColorClass[colorForPct(bar.val)],
                        )}
                      >
                        {bar.val}%
                      </span>
                    </div>
                    <ProgressBar pct={bar.val} />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-[13px] border-t border-border-1">
                <div className="flex gap-4 text-[11px] text-text-2">
                  <span>{sv.projects} loyiha</span>
                  <span>{sv.uptime}</span>
                </div>
                <div className="flex gap-[5px]" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    icon={ScrollText}
                    title="Monitoring"
                    onClick={() => router.push(`/servers/${sv.id}`)}
                  />
                  {canManage && (
                    <IconButton
                      icon={RotateCw}
                      title="Restart"
                      hover="accent"
                      onClick={() => toast.success(`${sv.name} qayta ishga tushirildi`)}
                    />
                  )}
                  {canManage && !isOffline && (
                    <IconButton
                      icon={Square}
                      title="Diagnostika"
                      hover="danger"
                      onClick={() => toast.info(`${sv.name} diagnostika boshlandi`)}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {canManage && (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex flex-col items-center justify-center gap-[9px] min-h-[150px] bg-transparent border-[1.5px] border-dashed border-border-2 rounded-xl cursor-pointer text-text-3 hover:border-accent hover:text-accent"
        >
          <div className="w-10 h-10 rounded-full bg-bg-2 flex items-center justify-center">
            <Plus size={20} strokeWidth={1.8} />
          </div>
          <span className="text-[12.5px] font-medium">Yangi server qo&apos;shish</span>
        </button>
      )}
      <AddServerModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
