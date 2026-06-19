"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 759px)");
export const useIsTablet = () => useMediaQuery("(min-width: 760px) and (max-width: 1099px)");
