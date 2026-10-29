/**
 * Navigation — add/remove/reorder items here. The Floating Dock, footer and
 * terminal (`ls`, `open <section>`) all read this list.
 */

export type IconName =
  | "home"
  | "user"
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "github"
  | "resume"
  | "theme";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  /** one-line description for the terminal `ls` output */
  description: string;
}

/** Internal pages (also the terminal's "sections"). */
export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home", description: "Landing page and terminal" },
  { id: "about", label: "About", href: "/about/", icon: "user", description: "Background and direction" },
  { id: "projects", label: "Projects", href: "/projects/", icon: "projects", description: "Things I have built" },
  { id: "skills", label: "Skills", href: "/skills/", icon: "skills", description: "Tools and technologies" },
  { id: "experience", label: "Experience", href: "/experience/", icon: "experience", description: "Work, leadership, awards" },
  { id: "contact", label: "Contact", href: "/contact/", icon: "contact", description: "Ways to reach me" },
];

export type DockEntry =
  | { type: "link"; id: string; label: string; href: string; icon: IconName; external?: boolean; desktopOnly?: boolean }
  | { type: "theme"; id: string; label: string; icon: IconName };

/** Order of items in the bottom Floating Dock. */
export const dockEntries: DockEntry[] = [
  ...navItems.map((n) => ({ type: "link" as const, id: n.id, label: n.label, href: n.href, icon: n.icon })),
  {
    type: "link",
    id: "github",
    label: "GitHub",
    href: "https://github.com/0xC0ba1t",
    icon: "github",
    external: true,
    desktopOnly: true,
  },
  { type: "theme", id: "theme", label: "Theme", icon: "theme" },
];

/** Footer groups. Each group is independent; remove a group by deleting it. */
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}
export interface FooterGroup {
  id: string;
  title: string;
  links: FooterLink[];
}
