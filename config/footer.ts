import { navItems, type FooterGroup } from "@/config/navigation";
import { site } from "@/config/site";
import { socials } from "@/data/socials";
import { getProjects, projectHref } from "@/lib/projects";

/**
 * Footer groups, derived from navigation, projects and socials.
 * Delete or reorder groups to change the footer; each is independent.
 */
export function getFooterGroups(): FooterGroup[] {
  const groups: FooterGroup[] = [
    {
      id: "navigation",
      title: "Navigation",
      links: navItems.map((n) => ({ label: n.label, href: n.href })),
    },
    {
      id: "projects",
      title: "Projects",
      links: getProjects()
        .slice(0, 5)
        .map((p) => ({ label: p.name, href: projectHref(p) })),
    },
    {
      id: "socials",
      title: "Elsewhere",
      links: socials
        .filter((s) => s.kind === "code" || s.kind === "profile" || s.kind === "site")
        .map((s) => ({ label: s.label, href: s.href, external: true })),
    },
    {
      id: "resources",
      title: "Resources",
      links: [
        ...(site.resumeUrl ? [{ label: "Résumé (PDF)", href: site.resumeUrl, external: true }] : []),
        { label: "Source of this site", href: site.sourceUrl, external: true },
        { label: "PGP key", href: site.pgp.url, external: true },
        { label: "Sitemap", href: "/sitemap.xml" },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      links: [{ label: site.email, href: `mailto:${site.email}`, external: true }],
    },
  ];
  return groups;
}
