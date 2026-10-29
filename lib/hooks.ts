"use client";

import { useEffect, useSyncExternalStore } from "react";

/** Subscribe to a media query without hydration mismatches (server value is used until hydrated). */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/** True on devices with a mouse-like pointer that can hover. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", false);
}

/** Calls `callback` when the document becomes hidden/visible. */
export function useDocumentVisibility(callback: (visible: boolean) => void): void {
  useEffect(() => {
    const handler = () => callback(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [callback]);
}
