"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useUiStore } from "@/store/uiStore";

function ThemeInit() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInit />
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-1)",
            color: "var(--text-1)",
            border: "1px solid var(--border-1)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
