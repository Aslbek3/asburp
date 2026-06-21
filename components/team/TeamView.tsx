"use client";

import { useState } from "react";
import { Search, UserPlus, MoreVertical, Check, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { Modal, ConfirmModal } from "@/components/shared/Modal";
import { SkeletonRow } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTeam } from "@/hooks/useMisc";
import { useTeamStore } from "@/store/teamStore";
import { useCan } from "@/lib/permissions";
import type { TeamRole, TeamRow } from "@/lib/types";

const roleTone: Record<TeamRole, { bg: string; color: string }> = {
  Admin: { bg: "bg-purple-soft", color: "text-purple" },
  Developer: { bg: "bg-accent-soft", color: "text-accent" },
  Viewer: { bg: "bg-bg-3", color: "text-text-2" },
};

const allRoles: TeamRole[] = ["Admin", "Developer", "Viewer"];

export function TeamView() {
  const { data, isLoading } = useTeam();
  const [search, setSearch] = useState("");
  const canAdmin = useCan("admin");
  const roleOverrides = useTeamStore((s) => s.roleOverrides);
  const removedIds = useTeamStore((s) => s.removedIds);
  const setRole = useTeamStore((s) => s.setRole);
  const removeMember = useTeamStore((s) => s.remove);
  const restoreMember = useTeamStore((s) => s.restore);
  const [manageTarget, setManageTarget] = useState<TeamRow | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamRow | null>(null);

  const rows = (data ?? [])
    .filter((t) => !removedIds.includes(t.id))
    .map((t) => ({ ...t, role: roleOverrides[t.id] ?? t.role }));

  const filtered = rows.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()),
  );

  const confirmRemove = () => {
    if (!removeTarget) return;
    const member = removeTarget;
    removeMember(member.id);
    toast.error(`${member.name} jamoadan chiqarildi`, {
      action: { label: "Bekor qilish", onClick: () => restoreMember(member.id) },
    });
    setRemoveTarget(null);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[10px]">
        <div className="flex-1 flex items-center gap-2 h-[34px] px-[11px] bg-bg-1 border border-border-1 rounded-lg focus-within:border-accent">
          <Search size={14} strokeWidth={2} className="text-text-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sherik qidirish..."
            className="flex-1 border-none outline-none bg-transparent text-[12.5px] text-text-1"
          />
        </div>
        {canAdmin && (
          <button
            type="button"
            onClick={() => toast.success("Taklif yuborildi")}
            className="flex items-center gap-[7px] h-[34px] px-4 border border-accent rounded-lg bg-accent text-white text-[12.5px] font-medium cursor-pointer"
          >
            <UserPlus size={14} strokeWidth={1.9} />
            Taklif yuborish
          </button>
        )}
      </div>

      {!canAdmin && (
        <div className="text-[11.5px] text-text-3">
          Rol va a&apos;zolikni boshqarish faqat <span className="font-medium text-text-2">Admin</span> uchun mavjud.
        </div>
      )}

      <Card padding="p-0" className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[12.5px]">
          <thead>
            <tr className="text-[10px] text-text-3 uppercase tracking-[0.05em] border-b border-border-1">
              <th className="text-left font-medium px-4 py-3">Foydalanuvchi</th>
              <th className="text-left font-medium px-4 py-3">Role</th>
              <th className="text-left font-medium px-4 py-3">Oxirgi kirgan</th>
              <th className="text-left font-medium px-4 py-3">2FA</th>
              <th className="text-right font-medium px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}
            {filtered.map((t) => {
              const tone = roleTone[t.role];
              return (
                <tr key={t.id} className="border-b border-border-1 last:border-b-0">
                  <td className="px-4 py-3 flex items-center gap-[10px]">
                    <span className="w-7 h-7 rounded-full bg-purple-soft text-purple flex items-center justify-center text-[10.5px] font-semibold flex-none">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-[11px] text-text-3">{t.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10.5px] font-semibold px-2 py-[2px] rounded-full ${tone.bg} ${tone.color}`}>
                      {t.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-2">{t.lastSeen}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-[6px] ${t.twoFa ? "text-green" : "text-text-3"}`}>
                      <span className={`w-[6px] h-[6px] rounded-full ${t.twoFa ? "bg-green" : "bg-text-3"}`} />
                      {t.twoFa ? "Yoqilgan" : "Yo'q"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canAdmin && (
                      <button
                        type="button"
                        onClick={() => setManageTarget(t)}
                        className="w-[26px] h-[26px] inline-flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer hover:bg-bg-2"
                      >
                        <MoreVertical size={14} strokeWidth={1.8} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState title="Sherik topilmadi" description="Qidiruvga mos foydalanuvchi yo'q." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        open={!!manageTarget}
        onOpenChange={(open) => !open && setManageTarget(null)}
        title={manageTarget ? `${manageTarget.name} — boshqarish` : ""}
      >
        <div className="flex flex-col gap-1 mb-4">
          <div className="text-[11px] text-text-3 uppercase tracking-[0.05em] mb-1">Rol</div>
          {allRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                if (manageTarget) {
                  setRole(manageTarget.id, role);
                  toast.success(`${manageTarget.name} roli ${role}ga o'zgartirildi`);
                  setManageTarget(null);
                }
              }}
              className="w-full flex items-center justify-between px-[10px] py-[8px] rounded-[7px] text-[12.5px] cursor-pointer hover:bg-bg-2 text-text-1"
            >
              {role}
              {manageTarget?.role === role && <Check size={14} className="text-accent" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setRemoveTarget(manageTarget);
            setManageTarget(null);
          }}
          className="w-full flex items-center gap-2 px-[10px] py-[8px] rounded-[7px] text-[12.5px] cursor-pointer text-red hover:bg-red-soft"
        >
          <UserMinus size={14} strokeWidth={1.8} />
          A&apos;zoni o&apos;chirish
        </button>
      </Modal>

      <ConfirmModal
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="A'zoni o'chirish"
        description={`"${removeTarget?.name}" jamoadan o'chirilsinmi? U panelga kira olmaydi.`}
        danger
        confirmLabel="O'chirish"
        onConfirm={confirmRemove}
      />
    </div>
  );
}
