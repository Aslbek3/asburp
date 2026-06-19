"use client";

import { useState } from "react";
import { Folder, FileCode2, FileCog, File, Upload, FolderPlus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useFiles } from "@/hooks/useMisc";
import { cn } from "@/lib/utils";

const tree = [
  { label: "var", depth: 0 },
  { label: "www", depth: 1 },
  { label: "navbat-web", depth: 2, active: true },
  { label: "core-api", depth: 2 },
  { label: "log", depth: 1 },
  { label: "home", depth: 0 },
  { label: "etc", depth: 0 },
];

const kindMeta = {
  dir: { icon: Folder, color: "text-accent" },
  config: { icon: FileCog, color: "text-amber" },
  code: { icon: FileCode2, color: "text-text-2" },
  file: { icon: File, color: "text-text-2" },
};

export function FilesView() {
  const { data } = useFiles();

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-[230px_1fr] gap-[14px] h-[calc(100vh-53px-36px)]">
      <Card padding="p-2" className="overflow-y-auto">
        {tree.map((t) => (
          <button
            key={t.label}
            type="button"
            style={{ paddingLeft: 8 + t.depth * 16 }}
            className={cn(
              "w-full flex items-center gap-2 py-[7px] rounded-[7px] text-[12px] text-left cursor-pointer",
              t.active ? "bg-accent-soft text-accent font-medium" : "text-text-2 hover:bg-bg-2",
            )}
          >
            <Folder size={14} strokeWidth={1.7} />
            {t.label}
          </button>
        ))}
      </Card>

      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 text-[12px] text-text-2 font-mono">
            <span>var</span>
            <ChevronRight size={12} />
            <span>www</span>
            <ChevronRight size={12} />
            <span className="text-text-1 font-medium">navbat-web</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success("Fayl yuklandi")}
              className="flex items-center gap-[6px] h-[30px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
            >
              <Upload size={13} strokeWidth={1.8} />
              Upload
            </button>
            <button
              type="button"
              onClick={() => toast.info("Yangi papka yaratildi")}
              className="flex items-center gap-[6px] h-[30px] px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
            >
              <FolderPlus size={13} strokeWidth={1.8} />
              Yangi papka
            </button>
          </div>
        </div>

        <Card padding="p-0" className="overflow-x-auto flex-1">
          <table className="w-full min-w-[520px] text-[12.5px]">
            <thead>
              <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
                <th className="text-left font-medium px-4 py-3">Nom</th>
                <th className="text-left font-medium px-4 py-3">Hajm</th>
                <th className="text-left font-medium px-4 py-3">O&apos;zgartirilgan</th>
                <th className="text-left font-medium px-4 py-3">Ruxsat</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((f) => {
                const meta = kindMeta[f.kind];
                return (
                  <tr
                    key={f.id}
                    onClick={() => toast.info(`${f.name} ochildi`)}
                    className="border-b border-border-1 last:border-b-0 cursor-pointer hover:bg-bg-2"
                  >
                    <td className="px-4 py-3 flex items-center gap-2 font-medium">
                      <meta.icon size={15} strokeWidth={1.7} className={meta.color} />
                      {f.name}
                    </td>
                    <td className="px-4 py-3 text-text-2">{f.size}</td>
                    <td className="px-4 py-3 text-text-2">{f.modified}</td>
                    <td className="px-4 py-3 font-mono text-text-2">{f.perms}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
