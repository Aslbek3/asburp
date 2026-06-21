"use client";

import { useState } from "react";
import { Database, Download, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { ConfirmModal } from "@/components/shared/Modal";
import { SkeletonRow } from "@/components/shared/Skeleton";
import { useDbGroups } from "@/hooks/useMisc";
import { useDatabaseStore } from "@/store/databaseStore";
import { useCan } from "@/lib/permissions";
import type { DbRow } from "@/lib/types";

const engineMeta = {
  postgres: { label: "PostgreSQL", color: "text-accent", bg: "bg-accent-soft" },
  mysql: { label: "MySQL", color: "text-amber", bg: "bg-amber-soft" },
};

export function DatabasesView() {
  const { data, isLoading } = useDbGroups();
  const removedIds = useDatabaseStore((s) => s.removedIds);
  const remove = useDatabaseStore((s) => s.remove);
  const restore = useDatabaseStore((s) => s.restore);
  const canDestroy = useCan("destructive");
  const [deleteTarget, setDeleteTarget] = useState<DbRow | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const db = deleteTarget;
    remove(db.id);
    toast.error(`${db.name} o'chirildi`, {
      action: { label: "Bekor qilish", onClick: () => restore(db.id) },
    });
  };

  const exportSelected = () => {
    toast.success(`${selected.length} ta database eksport qilindi`);
    setSelected([]);
  };

  const confirmBulkDelete = () => {
    const ids = [...selected];
    ids.forEach((id) => remove(id));
    setSelected([]);
    setBulkDeleteOpen(false);
    toast.error(`${ids.length} ta database o'chirildi`, {
      action: { label: "Bekor qilish", onClick: () => ids.forEach((id) => restore(id)) },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[18px]">
        <Card padding="p-0">
          <table className="w-full text-[12.5px]">
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} cols={5} />
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {selected.length > 0 && (
        <Card padding="p-[10px_14px]" className="flex items-center justify-between">
          <span className="text-[12.5px] font-medium">{selected.length} ta tanlandi</span>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={exportSelected}
              className="h-8 px-3 border border-border-1 rounded-lg bg-bg-1 text-[11.5px] font-medium cursor-pointer hover:bg-bg-2"
            >
              Eksport qilish
            </button>
            {canDestroy && (
              <button
                type="button"
                onClick={() => setBulkDeleteOpen(true)}
                className="h-8 px-3 border border-border-1 rounded-lg bg-bg-1 text-[11.5px] font-medium cursor-pointer hover:bg-red-soft hover:text-red"
              >
                O&apos;chirish
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelected([])}
              className="h-8 px-3 rounded-lg text-[11.5px] font-medium cursor-pointer text-text-2 hover:bg-bg-2"
            >
              Bekor qilish
            </button>
          </div>
        </Card>
      )}

      {(data ?? []).map((group) => {
        const meta = engineMeta[group.engine];
        const rows = group.rows.filter((r) => !removedIds.includes(r.id));
        return (
          <div key={group.engine} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-semibold ${meta.color}`}>{meta.label}</span>
              <span className={`text-[10.5px] font-semibold px-2 py-[1px] rounded-full ${meta.bg} ${meta.color}`}>
                {rows.length}
              </span>
            </div>
            <Card padding="p-0" className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-[12.5px]">
                <thead>
                  <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
                    <th className="px-4 py-3 w-[34px]" />
                    <th className="text-left font-medium px-4 py-3">Nomi</th>
                    <th className="text-left font-medium px-4 py-3">Hajm</th>
                    <th className="text-left font-medium px-4 py-3">User</th>
                    <th className="text-left font-medium px-4 py-3">Loyiha</th>
                    <th className="text-right font-medium px-4 py-3">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((db) => (
                    <tr key={db.id} className="border-b border-border-1 last:border-b-0">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(db.id)}
                          onChange={() => toggleOne(db.id)}
                          aria-label={`${db.name} tanlash`}
                          className="w-[14px] h-[14px] cursor-pointer accent-accent"
                        />
                      </td>
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
                          {canDestroy && (
                            <button
                              type="button"
                              title="O'chirish"
                              onClick={() => setDeleteTarget(db)}
                              className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-red-soft hover:text-red"
                            >
                              <Trash2 size={13} strokeWidth={1.8} />
                            </button>
                          )}
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

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Databasani o'chirish"
        description={`"${deleteTarget?.name}" databasasini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
        danger
        confirmLabel="O'chirish"
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Databasalarni o'chirish"
        description={`${selected.length} ta databasani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
        danger
        confirmLabel="O'chirish"
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}
