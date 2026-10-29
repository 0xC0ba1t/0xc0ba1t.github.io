"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultThemeId, THEME_STORAGE_KEY, themes, type ThemeId } from "@/config/theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The inline boot script in <head> sets data-theme before first paint. This provider
 * starts from the default (matching the server render) and syncs from the attribute
 * after mount, so there is no hydration mismatch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultThemeId);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    const match = themes.find((t) => t.id === current);
    if (match) setThemeState(match.id);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* storage unavailable: the theme still applies for this visit */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
