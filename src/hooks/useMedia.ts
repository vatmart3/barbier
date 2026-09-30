"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** Media query réactive ; `fallback` est utilisé au rendu serveur. */
export function useMedia(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotionPref = () => useMedia("(prefers-reduced-motion: reduce)", false);
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)", false);
export const useIsDesktop = () => useMedia("(min-width: 64rem)", false);
