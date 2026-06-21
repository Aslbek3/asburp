"use client";

import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { useServerStore } from "@/store/serverStore";

export function ServerFilters() {
  const search = useServerStore((s) => s.search);
  const setSearch = useServerStore((s) => s.setSearch);
  const statusFilter = useServerStore((s) => s.statusFilter);
  const setStatusFilter = useServerStore((s) => s.setStatusFilter);

  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex-1 flex items-center gap-2 h-[34px] px-[11px] bg-bg-1 border border-border-1 rounded-lg focus-within:border-accent">
        <Search size={14} strokeWidth={2} className="text-text-3" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Server qidirish (nom, IP)..."
          className="flex-1 border-none outline-none bg-transparent text-[12.5px] text-text-1"
        />
      </div>
      <SegmentedControl
        options={[
          { value: "all", label: "Barchasi" },
          { value: "online", label: "Online" },
          { value: "offline", label: "Offline" },
        ]}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </div>
  );
}
