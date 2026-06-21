"use client";

import { useState } from "react";
import { Folder, FileCode2, FileCog, File, Upload, FolderPlus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { useFiles } from "@/hooks/useMisc";
import { useCan } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const tree = [
  { label: "var", depth: 0, path: ["var"] },
  { label: "www", depth: 1, path: ["var", "www"] },
  { label: "navbat-web", depth: 2, path: ["var", "www", "navbat-web"] },
  { label: "core-api", depth: 2, path: ["var", "www", "core-api"] },
  { label: "log", depth: 1, path: ["var", "log"] },
  { label: "home", depth: 0, path: ["home"] },
  { label: "etc", depth: 0, path: ["etc"] },
];

const kindMeta = {
  dir: { icon: Folder, color: "text-accent" },
  config: { icon: FileCog, color: "text-amber" },
  code: { icon: FileCode2, color: "text-text-2" },
  file: { icon: File, color: "text-text-2" },
};

const FOLDER_WITH_DATA = "var/www/navbat-web";

export function FilesView() {
  const { data } = useFiles();
  const canManage = useCan("manage");
  const [activePath, setActivePath] = useState<string[]>(["var", "www", "navbat-web"]);
  const hasData = activePath.join("/") === FOLDER_WITH_DATA;

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-[230px_1fr] gap-[14px] h-[calc(100vh-53px-36px)]">
      <Card padding="p-2" className="overflow-y-auto">
        {tree.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActivePath(t.path)}
            style={{ paddingLeft: 8 + t.depth * 16 }}
            className={cn(
              "w-full flex items-center gap-2 py-[7px] rounded-[7px] text-[12px] text-left cursor-pointer",
              t.path.join("/") === activePath.join("/")
                ? "bg-accent-soft text-accent font-medium"
                : "text-text-2 hover:bg-bg-2",
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
            {activePath.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className={i === activePath.length - 1 ? "text-text-1 font-medium" : ""}>{seg}</span>
                {i < activePath.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </div>
          {canManage && (
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
          )}
        </div>

        <Card padding="p-0" className="overflow-x-auto flex-1">
          {hasData ? (
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
          ) : (
            <EmptyState title="Papka bo'sh" description="Bu papkada hech qanday fayl topilmadi." />
          )}
        </Card>
      </div>
    </div>
  );
}
