"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronsLeft, ChevronsRight, LogOut, Moon, Sun, X } from "lucide-react";
import { navGroups } from "@/lib/nav";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useServerStore } from "@/store/serverStore";
import { useServers } from "@/hooks/useServers";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapsed = useUiStore((s) => s.toggleSidebarCollapsed);
  const isMobile = useIsMobile();
  const collapsed = sidebarCollapsed && !isMobile;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: servers } = useServers();
  const selectedServerId = useServerStore((s) => s.selectedServerId);
  const setSelectedServerId = useServerStore((s) => s.setSelectedServerId);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const current = (servers ?? []).find((s) => s.id === selectedServerId) ?? servers?.[0];

  useEffect(() => {
    if (!switcherOpen) return;
    const onClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [switcherOpen]);

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "bg-bg-1 border-r border-border-1 flex flex-col flex-none h-full transition-[width] duration-150",
        collapsed ? "w-[64px]" : "w-[212px]",
        isMobile &&
          "fixed inset-y-0 left-0 z-[60] w-[230px] transition-transform duration-[.25s]",
        isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
      )}
    >
      <div className={cn("flex items-center justify-between px-[14px] pt-[14px] pb-3", collapsed && "px-0 justify-center")}>
        <div className={cn("flex items-center gap-[9px]", collapsed && "flex-col gap-2")}>
          <div className="w-[26px] h-[26px] rounded-[7px] bg-accent flex items-center justify-center text-white font-semibold text-sm flex-none">
            C
          </div>
          {!collapsed && <span className="text-[14.5px] font-semibold tracking-[-0.02em]">CorePanel</span>}
        </div>
        {!collapsed && (
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              title="Tema"
              onClick={toggleTheme}
              className="w-7 h-7 flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 hover:bg-bg-2 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
            </button>
            {!isMobile && (
              <button
                type="button"
                title="Sidebarni yig'ish"
                onClick={toggleSidebarCollapsed}
                className="w-7 h-7 flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 hover:bg-bg-2 cursor-pointer"
              >
                <ChevronsLeft size={15} strokeWidth={1.8} />
              </button>
            )}
            {isMobile && (
              <button
                type="button"
                title="Yopish"
                onClick={closeSidebar}
                className="w-7 h-7 flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 cursor-pointer"
              >
                <X size={15} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center pb-3">
          <button
            type="button"
            title="Sidebarni yoyish"
            onClick={toggleSidebarCollapsed}
            className="w-7 h-7 flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 hover:bg-bg-2 cursor-pointer"
          >
            <ChevronsRight size={15} strokeWidth={1.8} />
          </button>
        </div>
      )}

      <div className={cn("px-3 pb-3 relative", collapsed && "px-2")} ref={switcherRef}>
        <button
          type="button"
          title={collapsed ? `${current?.name ?? ""} — serverni almashtirish` : undefined}
          onClick={() => setSwitcherOpen((o) => !o)}
          className={cn(
            "w-full flex items-center gap-[9px] border border-border-1 rounded-lg bg-bg-2 cursor-pointer hover:border-border-2 text-text-1",
            collapsed ? "justify-center h-9" : "px-[9px] py-[7px]",
          )}
        >
          <span
            className={cn(
              "w-[7px] h-[7px] rounded-full flex-none",
              current?.status === "online" ? "bg-green" : "bg-red",
            )}
          />
          {!collapsed && (
            <>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate">{current?.name ?? "—"}</div>
                <div className="text-[10px] text-text-3">
                  {current?.location ?? ""} · {servers?.length ?? 0} server
                </div>
              </div>
              <ChevronDown size={13} className={cn("text-text-3 transition-transform", switcherOpen && "rotate-180")} />
            </>
          )}
        </button>

        {switcherOpen && (
          <div
            className={cn(
              "absolute top-full mt-[6px] z-50 bg-bg-1 border border-border-1 rounded-lg shadow-lg overflow-hidden",
              collapsed ? "left-2 w-[200px]" : "left-3 right-3",
            )}
          >
            {(servers ?? []).map((sv) => (
              <button
                key={sv.id}
                type="button"
                onClick={() => {
                  setSelectedServerId(sv.id);
                  setSwitcherOpen(false);
                  router.push(`/servers/${sv.id}`);
                  if (isMobile) closeSidebar();
                }}
                className={cn(
                  "w-full flex items-center gap-[9px] px-[10px] py-[8px] text-left cursor-pointer",
                  sv.id === selectedServerId ? "bg-accent-soft text-accent" : "hover:bg-bg-2 text-text-1",
                )}
              >
                <span
                  className={cn(
                    "w-[7px] h-[7px] rounded-full flex-none",
                    sv.status === "online" ? "bg-green" : "bg-red",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">{sv.name}</div>
                  <div className="text-[10px] text-text-3">{sv.ip}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className={cn("flex-1 overflow-y-auto pb-2", collapsed ? "px-1" : "px-2")}>
        {navGroups.map((group) => (
          <div key={group.title} className="mb-[14px]">
            {!collapsed && (
              <div className="text-[10px] font-semibold text-text-3 uppercase tracking-[0.07em] px-2 pb-[6px]">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={() => isMobile && closeSidebar()}
                  className={cn(
                    "w-full flex items-center gap-[10px] mb-[1px] rounded-[7px] text-[12.5px]",
                    collapsed ? "justify-center h-9" : "px-[9px] py-[6px]",
                    active
                      ? "bg-accent-soft text-accent font-medium"
                      : "text-text-2 hover:bg-bg-2",
                  )}
                >
                  <Icon size={16} strokeWidth={1.7} className="flex-none" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9.5px] font-semibold bg-red-soft text-red px-[6px] py-[1px] rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-border-1 flex items-center gap-[9px]", collapsed ? "flex-col py-[10px] px-1" : "px-3 py-[10px]")}>
        <div
          title={collapsed ? user.name : undefined}
          className="w-7 h-7 rounded-full bg-purple-soft text-purple flex items-center justify-center text-[11px] font-semibold flex-none"
        >
          {user.initials}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate">{user.name}</div>
            <div className="text-[10px] text-text-3">{user.role}</div>
          </div>
        )}
        <button
          type="button"
          title="Chiqish"
          onClick={onLogout}
          className="w-6 h-6 flex items-center justify-center rounded-[6px] bg-transparent text-text-3 hover:bg-red-soft hover:text-red cursor-pointer"
        >
          <LogOut size={15} strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  );
}
