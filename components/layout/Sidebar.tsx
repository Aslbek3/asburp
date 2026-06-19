"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Moon, Sun, X } from "lucide-react";
import { navGroups } from "@/lib/nav";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const isMobile = useIsMobile();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "w-[212px] bg-bg-1 border-r border-border-1 flex flex-col flex-none h-full",
        isMobile &&
          "fixed inset-y-0 left-0 z-[60] w-[230px] transition-transform duration-[.25s]",
        isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
      )}
    >
      <div className="flex items-center justify-between px-[14px] pt-[14px] pb-3">
        <div className="flex items-center gap-[9px]">
          <div className="w-[26px] h-[26px] rounded-[7px] bg-accent flex items-center justify-center text-white font-semibold text-sm">
            C
          </div>
          <span className="text-[14.5px] font-semibold tracking-[-0.02em]">CorePanel</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            title="Tema"
            onClick={toggleTheme}
            className="w-7 h-7 flex items-center justify-center border border-border-1 rounded-[7px] bg-bg-1 text-text-2 hover:bg-bg-2 cursor-pointer"
          >
            {theme === "dark" ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
          </button>
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
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          className="w-full flex items-center gap-[9px] px-[9px] py-[7px] border border-border-1 rounded-lg bg-bg-2 cursor-pointer hover:border-border-2 text-text-1"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-green flex-none" />
          <div className="text-left flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate">contabo-de-01</div>
            <div className="text-[10px] text-text-3">Germaniya · 3 server</div>
          </div>
          <ChevronDown size={13} className="text-text-3" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-[14px]">
            <div className="text-[10px] font-semibold text-text-3 uppercase tracking-[0.07em] px-2 pb-[6px]">
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && closeSidebar()}
                  className={cn(
                    "w-full flex items-center gap-[10px] px-[9px] py-[6px] mb-[1px] rounded-[7px] text-[12.5px]",
                    active
                      ? "bg-accent-soft text-accent font-medium"
                      : "text-text-2 hover:bg-bg-2",
                  )}
                >
                  <Icon size={16} strokeWidth={1.7} className="flex-none" />
                  <span className="flex-1 whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9.5px] font-semibold bg-red-soft text-red px-[6px] py-[1px] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border-1 px-3 py-[10px] flex items-center gap-[9px]">
        <div className="w-7 h-7 rounded-full bg-purple-soft text-purple flex items-center justify-center text-[11px] font-semibold flex-none">
          {user.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium truncate">{user.name}</div>
          <div className="text-[10px] text-text-3">{user.role}</div>
        </div>
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
