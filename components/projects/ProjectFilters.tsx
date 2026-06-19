"use client";

import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { useProjectStore } from "@/store/projectStore";

export function ProjectFilters() {
  const search = useProjectStore((s) => s.search);
  const setSearch = useProjectStore((s) => s.setSearch);
  const typeFilter = useProjectStore((s) => s.typeFilter);
  const setTypeFilter = useProjectStore((s) => s.setTypeFilter);

  return (
    <div className="flex items-center gap-[10px]">
      <SegmentedControl
        options={[
          { value: "all", label: "Barchasi" },
          { value: "bot", label: "Bot" },
          { value: "web", label: "Web" },
          { value: "api", label: "API" },
        ]}
        value={typeFilter}
        onChange={setTypeFilter}
      />
      <div className="flex-1 flex items-center gap-2 h-[34px] px-[11px] bg-bg-1 border border-border-1 rounded-lg">
        <Search size={14} strokeWidth={2} className="text-text-3" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Loyiha qidirish..."
          className="flex-1 border-none outline-none bg-transparent text-[12.5px] text-text-1"
        />
      </div>
    </div>
  );
}
