"use client";

import { Database, Download, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useDbGroups } from "@/hooks/useMisc";

const engineMeta = {
  postgres: { label: "PostgreSQL", color: "text-accent", bg: "bg-accent-soft" },
  mysql: { label: "MySQL", color: "text-amber", bg: "bg-amber-soft" },
};

export function DatabasesView() {
  const { data } = useDbGroups();

  return (
    <div className="flex flex-col gap-[18px]">
      {(data ?? []).map((group) => {
        const meta = engineMeta[group.engine];
        return (
          <div key={group.engine} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-semibold ${meta.color}`}>{meta.label}</span>
              <span className={`text-[10.5px] font-semibold px-2 py-[1px] rounded-full ${meta.bg} ${meta.color}`}>
                {group.rows.length}
              </span>
            </div>
            <Card padding="p-0" className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-[12.5px]">
                <thead>
                  <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
                    <th className="text-left font-medium px-4 py-3">Nomi</th>
                    <th className="text-left font-medium px-4 py-3">Hajm</th>
                    <th className="text-left font-medium px-4 py-3">User</th>
                    <th className="text-left font-medium px-4 py-3">Loyiha</th>
                    <th className="text-right font-medium px-4 py-3">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((db) => (
                    <tr key={db.id} className="border-b border-border-1 last:border-b-0">
                      <td className="px-4 py-3 font-mono font-medium flex items-center gap-2">
                        <Database size={14} strokeWidth={1.6} className="text-text-3" />
                        {db.name}
                      </td>
                      <td className="px-4 py-3 text-text-2">{db.size}</td>
                      <td className="px-4 py-3 font-mono text-text-2">{db.user}</td>
                      <td className="px-4 py-3 text-text-2">{db.project}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-[5px]">
                          <button
                            type="button"
                            title="Export"
                            onClick={() => toast.success(`${db.name} eksport qilindi`)}
                            className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                          >
                            <Download size={13} strokeWidth={1.8} />
                          </button>
                          <button
                            type="button"
                            title="Adminer"
                            onClick={() => toast.info(`${db.name}: Adminer ochiladi`)}
                            className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                          >
                            <ExternalLink size={13} strokeWidth={1.8} />
                          </button>
                          <button
                            type="button"
                            title="O'chirish"
                            onClick={() => toast.error(`${db.name} o'chirildi`)}
                            className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-red-soft hover:text-red"
                          >
                            <Trash2 size={13} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
