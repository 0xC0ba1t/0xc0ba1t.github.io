import type { SocialLink } from "@/lib/types";
import { site } from "@/config/site";

/** Contact methods and social links. Add/remove entries freely — footer, contact page and terminal follow. */
export const socials: SocialLink[] = [
  { id: "email", label: "Email", href: `mailto:${site.email}`, handle: site.email, kind: "email" },
  { id: "email-alt", label: "Email (alternate)", href: `mailto:${site.altEmail}`, handle: site.altEmail, kind: "email" },
  { id: "github", label: "GitHub", href: "https://github.com/0xC0ba1t", handle: "@0xC0ba1t", kind: "code" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/adityapatil-c0ba1t/",
    handle: "adityapatil-c0ba1t",
    kind: "profile",
  },
  { id: "pgp", label: "PGP key", href: site.pgp.url, handle: site.pgp.id, kind: "key" },
  { id: "studies", label: "Study notes", href: "https://studies.c0ba1t.is-a.dev/", handle: "studies.c0ba1t.is-a.dev", kind: "site" },
];
