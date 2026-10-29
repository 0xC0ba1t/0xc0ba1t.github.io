import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Build-time route discovery for app/sitemap.ts.
 *
 * Walks the Next.js `app/` directory and turns every folder that contains a `page.*` file into a
 * URL, so a new page shows up in the sitemap without anyone remembering to list it.
 *
 *   app/about/page.tsx            →  /about/
 *   app/(marketing)/pricing/...   →  /pricing/      (route groups add no segment)
 *   app/_internal/..., app/@slot  →  skipped        (private folders and parallel slots)
 *   app/projects/[slug]/page.tsx  →  expanded by `dynamicRoutes` in app/sitemap.ts
 *
 * This runs only during `next build` (the site is a static export), never in the browser.
 */

const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

export interface DiscoveredRoute {
  /** URL path with a leading and trailing slash, e.g. "/about/" */
  path: string;
  /** Dynamic segments, e.g. ["slug"]; empty for static routes */
  params: string[];
  /** The route pattern as written on disk, e.g. "/projects/[slug]" */
  pattern: string;
}

function segmentKind(name: string): "skip" | "group" | "dynamic" | "static" {
  if (name.startsWith("_") || name.startsWith("@")) return "skip";
  if (/^\(.*\)$/.test(name)) return "group";
  if (/^\[.*\]$/.test(name)) return "dynamic";
  return "static";
}

export function discoverRoutes(appDir = path.join(process.cwd(), "app")): DiscoveredRoute[] {
  const found: DiscoveredRoute[] = [];

  const walk = (dir: string, segments: string[]) => {
    const entries = readdirSync(dir, { withFileTypes: true });

    if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
      const params = segments.filter((s) => /^\[.*\]$/.test(s)).map((s) => s.replace(/^\[+(?:\.\.\.)?|\]+$/g, ""));
      found.push({
        pattern: `/${segments.join("/")}`,
        path: segments.length ? `/${segments.join("/")}/` : "/",
        params,
      });
    }

    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const kind = segmentKind(e.name);
      if (kind === "skip") continue;
      walk(path.join(dir, e.name), kind === "group" ? segments : [...segments, e.name]);
    }
  };

  if (existsSync(appDir)) walk(appDir, []);
  return found.sort((a, b) => a.path.localeCompare(b.path));
}

/** Fill a dynamic route's `[param]` segments from one set of param values. */
export function fillRoute(route: DiscoveredRoute, values: Record<string, string>): string {
  let out = route.path;
  for (const key of route.params) {
    out = out.replace(new RegExp(`\\[(?:\\.\\.\\.)?${key}\\]`), encodeURIComponent(values[key] ?? ""));
  }
  return out;
}
