"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { toast } from "sonner";
import { navGroups } from "@/lib/nav";
import { useUiStore } from "@/store/uiStore";
import { serversRaw, projRaw } from "@/lib/mock-data";

export function CmdK() {
  const open = useUiStore((s) => s.cmdkOpen);
  const setOpen = useUiStore((s) => s.setCmdkOpen);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/45 flex items-start justify-center pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[480px] bg-bg-1 border border-border-1 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Buyruqlar palitra">
          <div className="flex items-center px-4 border-b border-border-1">
            <Command.Input
              autoFocus
              placeholder="Sahifa, server, loyiha yoki amal qidirish..."
              className="w-full h-[46px] bg-transparent outline-none border-none text-[13px] text-text-1"
            />
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-[12.5px] text-text-3">
              Hech narsa topilmadi.
            </Command.Empty>

            <Command.Group
              heading="Sahifalar"
              className="text-[10px] uppercase tracking-[0.05em] text-text-3 px-2 pt-2 pb-1"
            >
              {navGroups.flatMap((g) => g.items).map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => go(item.href)}
                  className="flex items-center gap-[10px] px-2 py-2 rounded-[7px] text-[12.5px] cursor-pointer data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent"
                >
                  <item.icon size={15} strokeWidth={1.7} />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Serverlar"
              className="text-[10px] uppercase tracking-[0.05em] text-text-3 px-2 pt-2 pb-1"
            >
              {serversRaw.map((s) => (
                <Command.Item
                  key={s.id}
                  onSelect={() => go("/servers")}
                  className="flex items-center gap-[10px] px-2 py-2 rounded-[7px] text-[12.5px] font-mono cursor-pointer data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent"
                >
                  {s.name}
                  <span className="text-text-3 font-sans">{s.ip}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Loyihalar"
              className="text-[10px] uppercase tracking-[0.05em] text-text-3 px-2 pt-2 pb-1"
            >
              {projRaw.map((p) => (
                <Command.Item
                  key={p.id}
                  onSelect={() => go("/projects")}
                  className="flex items-center gap-[10px] px-2 py-2 rounded-[7px] text-[12.5px] font-mono cursor-pointer data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent"
                >
                  {p.name}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Amallar"
              className="text-[10px] uppercase tracking-[0.05em] text-text-3 px-2 pt-2 pb-1"
            >
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  toast.success("Backup boshlandi");
                }}
                className="flex items-center gap-[10px] px-2 py-2 rounded-[7px] text-[12.5px] cursor-pointer data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent"
              >
                DB backup ishga tushirish
              </Command.Item>
              <Command.Item
                onSelect={() => go("/deploy")}
                className="flex items-center gap-[10px] px-2 py-2 rounded-[7px] text-[12.5px] cursor-pointer data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent"
              >
                Yangi deploy
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
