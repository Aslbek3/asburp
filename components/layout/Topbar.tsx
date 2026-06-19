"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { pageTitles } from "@/lib/nav";
import { useUiStore } from "@/store/uiStore";
import { useTopbarStore } from "@/store/topbarStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function Topbar() {
  const pathname = usePathname();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setCmdkOpen = useUiStore((s) => s.setCmdkOpen);
  const isMobile = useIsMobile();
  const actions = useTopbarStore((s) => s.actions);
  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/servers/") ? "Server tafsiloti" : "CorePanel");
  const showLive = pathname !== "/settings";

  return (
    <header className="h-[53px] flex-none flex items-center justify-between px-[18px] bg-bg-1 border-b border-border-1">
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <button
            type="button"
            title="Menyu"
            onClick={toggleSidebar}
            className="w-8 h-8 flex-none flex items-center justify-center border border-border-1 rounded-lg bg-bg-1 text-text-2 cursor-pointer -ml-1"
          >
            <Menu size={17} strokeWidth={1.9} />
          </button>
        )}
        <h1 className="text-[15px] font-semibold m-0 tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h1>
        {showLive && (
          <div className="flex items-center gap-[5px] py-[3px] pl-[7px] pr-2 bg-green-soft rounded-full">
            <span className="w-[6px] h-[6px] rounded-full bg-green cp-pulse" />
            <span className="text-[10px] font-semibold text-green tracking-[0.02em]">Live</span>
          </div>
        )}
        {showLive && !isMobile && (
          <span className="text-[11px] text-text-3">Yangilandi: hozir</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-none">
        <button
          type="button"
          title="Qidiruv (⌘K)"
          onClick={() => setCmdkOpen(true)}
          className="flex items-center gap-[7px] h-[30px] px-[10px] border border-border-1 rounded-lg bg-bg-2 text-text-3 text-[11.5px] cursor-pointer hover:border-border-2"
        >
          <Search size={13} strokeWidth={2} />
          {!isMobile && (
            <>
              <span>Qidiruv</span>
              <span className="border border-border-2 rounded px-1 text-[10px] font-medium">⌘K</span>
            </>
          )}
        </button>
        {!isMobile &&
          actions.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.label}
                type="button"
                onClick={b.onClick}
                className={cn(
                  "flex items-center gap-[6px] h-[30px] px-[11px] rounded-lg text-[12px] font-medium cursor-pointer border",
                  b.primary
                    ? "bg-accent border-accent text-white"
                    : "bg-bg-1 border-border-1 text-text-1 hover:bg-bg-2",
                )}
              >
                <Icon size={14} strokeWidth={1.8} />
                <span>{b.label}</span>
              </button>
            );
          })}
      </div>
    </header>
  );
}
