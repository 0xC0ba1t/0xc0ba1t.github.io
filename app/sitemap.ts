import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getProjects } from "@/lib/projects";
import { discoverRoutes, fillRoute } from "@/lib/sitemap";

export const dynamic = "force-static";

/**
 * Generated at build time from the app/ directory (see lib/sitemap.ts), so adding
 * app/<anything>/page.tsx adds it here automatically.
 *
 * Only two things are configured by hand:
 *  - `dynamicRoutes`: how to enumerate the values of a `[param]` route (here, from the data files).
 *    A dynamic route with no entry is left out and reported in the build log.
 *  - `exclude`: pages that exist but should not be listed.
 */
const dynamicRoutes: Record<string, () => Record<string, string>[]> = {
  "/projects/[slug]": () => getProjects().map((p) => ({ slug: p.slug })),
};

const exclude: string[] = [];

function priorityFor(path: string, depth: number): number {
  if (path === "/") return 1;
  return depth === 1 ? 0.8 : 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = new Map<string, number>(); // path → priority (Map de-duplicates)

  for (const route of discoverRoutes()) {
    if (exclude.includes(route.pattern)) continue;

    if (route.params.length === 0) {
      urls.set(route.path, priorityFor(route.path, route.path.split("/").filter(Boolean).length));
      continue;
    }

    const expand = dynamicRoutes[route.pattern];
    if (!expand) {
      console.warn(`[sitemap] ${route.pattern} is dynamic but has no entry in dynamicRoutes; it is not in the sitemap.`);
      continue;
    }
    for (const values of expand()) {
      const p = fillRoute(route, values);
      urls.set(p, priorityFor(p, p.split("/").filter(Boolean).length));
    }
  }

  return [...urls].map(([path, priority]) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority,
  }));
}
