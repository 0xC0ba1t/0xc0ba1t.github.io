/**
 * Design tokens — the single source of truth for colour.
 *
 * The five "slots" map to CSS variables (--obsidian, --charcoal, --stone,
 * --accent, --ivory). Tailwind utilities (bg-obsidian, text-ivory, bg-accent…)
 * and every component read from those variables, so editing a value here
 * restyles the entire site. `themeCss()` generates the CSS at build time.
 */

/** Old-money reference palette (from the supplied colour reference). */
export const palette = {
  obsidian: "#050505",
  charcoal: "#605C5B",
  stone: "#9D9994",
  oxblood: "#700F12",
  ivory: "#F2EFE6",
} as const;

export type ThemeId = "old-money" | "monochrome" | "amber-terminal";

export interface ThemeTokens {
  /** Main background and deep surfaces. */
  obsidian: string;
  /** Secondary panels and elevated surfaces. */
  charcoal: string;
  /** Muted text, borders, secondary information. */
  stone: string;
  /** Primary accent for fills and selected states (oxblood in the default theme). */
  accent: string;
  /** Main text and headings. */
  ivory: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
  tokens: ThemeTokens;
}

export const themes: ThemeDefinition[] = [
  {
    id: "old-money",
    label: "Old Money",
    description: "Obsidian, charcoal, stone, oxblood, ivory",
    tokens: {
      obsidian: palette.obsidian,
      charcoal: palette.charcoal,
      stone: palette.stone,
      accent: palette.oxblood,
      ivory: palette.ivory,
    },
  },
  {
    id: "monochrome",
    label: "Monochrome",
    description: "Black, graphite, grey, ivory",
    tokens: {
      obsidian: "#050505",
      charcoal: "#4A4A4A",
      stone: "#A3A3A3",
      accent: "#5C5C5C",
      ivory: "#F2F2EE",
    },
  },
  {
    id: "amber-terminal",
    label: "Amber Terminal",
    description: "Muted charcoal, amber, warm ivory",
    tokens: {
      obsidian: "#0A0806",
      charcoal: "#5F564C",
      stone: "#A39785",
      accent: "#8A5A12",
      ivory: "#F3E9D2",
    },
  },
];

export const defaultThemeId: ThemeId = "old-money";
export const THEME_STORAGE_KEY = "c0ba1t-theme";

function block(selector: string, t: ThemeTokens): string {
  return `${selector}{--obsidian:${t.obsidian};--charcoal:${t.charcoal};--stone:${t.stone};--accent:${t.accent};--ivory:${t.ivory};}`;
}

/** CSS variables for the default theme (on :root) and every theme (on [data-theme]). */
export function themeCss(): string {
  const base = block(":root", themes.find((t) => t.id === defaultThemeId)!.tokens);
  const all = themes.map((t) => block(`:root[data-theme="${t.id}"]`, t.tokens)).join("");
  return base + all;
}

/** Tiny inline script that applies the saved theme before first paint (no flash, no mismatch). */
export function themeBootScript(): string {
  const ids = JSON.stringify(themes.map((t) => t.id));
  return `(function(){var d=document.documentElement,def=${JSON.stringify(defaultThemeId)};try{var v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});d.setAttribute("data-theme",${ids}.indexOf(v)>-1?v:def);}catch(e){d.setAttribute("data-theme",def);}})();`;
}
