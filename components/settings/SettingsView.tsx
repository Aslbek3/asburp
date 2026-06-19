"use client";

import { User, SlidersHorizontal, Bell, KeyRound, DatabaseBackup } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import { Card } from "@/components/shared/Card";
import { useSettingsStore } from "@/store/settingsStore";
import { useSettingsData } from "@/hooks/useMisc";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profil" as const, label: "Profil", icon: User },
  { id: "panel" as const, label: "Panel", icon: SlidersHorizontal },
  { id: "bildirishnomalar" as const, label: "Bildirishnomalar", icon: Bell },
  { id: "api" as const, label: "API kalitlar", icon: KeyRound },
  { id: "backup" as const, label: "Backup", icon: DatabaseBackup },
];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-[11.5px] font-medium text-text-2 mb-[6px]">{label}</div>
      <div className="h-[36px] px-3 flex items-center bg-bg-2 border border-border-1 rounded-lg text-[12.5px] text-text-1">
        {value}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-1 last:border-b-0">
      <div>
        <div className="text-[12.5px] font-medium">{label}</div>
        <div className="text-[11px] text-text-3 mt-[2px]">{hint}</div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="w-9 h-5 rounded-full bg-bg-3 border border-border-1 relative data-[state=checked]:bg-accent cursor-pointer flex-none"
      >
        <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform translate-x-[3px] will-change-transform data-[state=checked]:translate-x-[18px]" />
      </Switch.Root>
    </div>
  );
}

export function SettingsView() {
  const activeTab = useSettingsStore((s) => s.activeTab);
  const setActiveTab = useSettingsStore((s) => s.setActiveTab);
  const { data } = useSettingsData();

  const save = () => toast.success("Sozlamalar saqlandi");

  return (
    <div className="grid grid-cols-1 tablet:grid-cols-[200px_1fr] gap-[14px] items-start">
      <Card padding="p-2">
        {tabs.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] text-[12.5px] text-left cursor-pointer mb-[2px]",
                active ? "bg-accent-soft text-accent font-medium" : "text-text-2 hover:bg-bg-2",
              )}
            >
              <t.icon size={16} strokeWidth={1.7} />
              {t.label}
            </button>
          );
        })}
      </Card>

      <Card padding="p-5">
        {activeTab === "profil" && data && (
          <>
            <SectionHeader title="Profil" desc="Shaxsiy ma'lumotlaringizni boshqaring." />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-purple-soft text-purple flex items-center justify-center text-lg font-semibold">
                AI
              </div>
              <button
                type="button"
                onClick={() => toast.info("Rasm yuklash oynasi ochiladi")}
                className="h-9 px-3 border border-border-1 rounded-lg bg-bg-1 text-[12px] font-medium cursor-pointer hover:bg-bg-2"
              >
                Rasm yuklash
              </button>
            </div>
            <Field label="Ism" value={data.profil.name} />
            <Field label="Email" value={data.profil.email} />
            <Field label="Role" value={data.profil.role} />
          </>
        )}

        {activeTab === "panel" && data && (
          <>
            <SectionHeader title="Panel" desc="CorePanel ko'rinishi va umumiy sozlamalar." />
            <Field label="Panel nomi" value={data.panel.panelName} />
            <Field label="Vaqt zonasi" value={data.panel.timezone} />
            <Field label="Til" value={data.panel.language} />
          </>
        )}

        {activeTab === "bildirishnomalar" && data && (
          <>
            <SectionHeader title="Bildirishnomalar" desc="Qaysi hodisalar uchun xabar olishni tanlang." />
            <ToggleRow label="Deploy" hint="Har bir deploy natijasi haqida xabar" checked={data.bildirishnomalar.deploy} onChange={() => toast.success("Saqlandi")} />
            <ToggleRow label="Ogohlantirishlar" hint="Server va jarayon xatolari" checked={data.bildirishnomalar.alerts} onChange={() => toast.success("Saqlandi")} />
            <ToggleRow label="SSL" hint="Sertifikat muddati tugashi haqida" checked={data.bildirishnomalar.ssl} onChange={() => toast.success("Saqlandi")} />
            <ToggleRow label="Haftalik hisobot" hint="Har dushanba ertalab" checked={data.bildirishnomalar.weeklyReport} onChange={() => toast.success("Saqlandi")} />
          </>
        )}

        {activeTab === "api" && data && (
          <>
            <SectionHeader title="API kalitlar" desc="CI/CD va tashqi integratsiyalar uchun tokenlar." />
            {data.api.map((k) => (
              <div key={k.id} className="flex items-center justify-between py-3 border-b border-border-1">
                <div>
                  <div className="text-[12.5px] font-medium font-mono">{k.name}</div>
                  <div className="text-[11px] text-text-3 mt-[2px]">Yaratilgan: {k.created} · {k.lastUsed}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.error(`${k.name} bekor qilindi`)}
                  className="h-8 px-3 border border-border-1 rounded-lg bg-bg-1 text-[11.5px] font-medium cursor-pointer hover:bg-red-soft hover:text-red"
                >
                  Bekor qilish
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => toast.success("Yangi API kalit yaratildi")}
              className="mt-3 h-9 px-3 border border-accent rounded-lg bg-accent text-white text-[12px] font-medium cursor-pointer"
            >
              Yangi kalit yaratish
            </button>
          </>
        )}

        {activeTab === "backup" && data && (
          <>
            <SectionHeader title="Backup" desc="Avtomatik zaxira nusxalash sozlamalari." />
            <Field label="Oxirgi backup" value={data.backup.lastBackup} />
            <Field label="Davriylik" value={data.backup.frequency} />
            <Field label="Saqlash muddati" value={data.backup.retention} />
            <button
              type="button"
              onClick={() => toast.success("Backup ishga tushirildi")}
              className="mt-1 h-9 px-3 border border-accent rounded-lg bg-accent text-white text-[12px] font-medium cursor-pointer"
            >
              Hozir backup qilish
            </button>
          </>
        )}

        <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border-1">
          <button
            type="button"
            className="h-9 px-4 rounded-lg border border-border-1 bg-bg-1 text-text-2 text-[12.5px] font-medium cursor-pointer hover:bg-bg-2"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={save}
            className="h-9 px-4 rounded-lg border border-accent bg-accent text-white text-[12.5px] font-medium cursor-pointer"
          >
            Saqlash
          </button>
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <div className="text-[14.5px] font-semibold">{title}</div>
      <div className="text-[12px] text-text-3 mt-[3px]">{desc}</div>
    </div>
  );
}
