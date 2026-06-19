"use client";

import { useEffect } from "react";
import { useTopbarStore, type TopbarAction } from "@/store/topbarStore";

export function useTopbarActions(actions: TopbarAction[], deps: unknown[] = []) {
  const setActions = useTopbarStore((s) => s.setActions);

  useEffect(() => {
    setActions(actions);
    return () => setActions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
