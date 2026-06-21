"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsMobile = () => useMediaQuery("(max-width: 759px)");
export const useIsTablet = () => useMediaQuery("(min-width: 760px) and (max-width: 1099px)");
