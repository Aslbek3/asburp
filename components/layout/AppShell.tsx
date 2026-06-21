"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthHydrated } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CmdK } from "@/components/shared/CmdK";

export function AppShell({ children }: { children: React.ReactNode }) {
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const hydrated = useAuthHydrated();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  if (!hydrated || !loggedIn) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/45 z-[55]"
        />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-[18px]">{children}</main>
      </div>
      <CmdK />
    </div>
  );
}
