/** Site-wide identity, SEO and contact configuration. */

export const site = {
  name: "Aditya Patil",
  handle: "c0ba1t",
  /** canonical origin — no trailing slash */
  url: "https://c0ba1t.is-a.dev",
  title: "Aditya Patil — c0ba1t",
  titleTemplate: "%s — c0ba1t",
  description:
    "Portfolio of Aditya Patil (c0ba1t): aspiring ML engineer working across PyTorch, Rust, systems programming, hardware and networking.",
  locale: "en_GB",
  role: "Aspiring ML engineer",
  tagline: "Cambridge A-Level student · PyTorch & Rust",

  author: {
    name: "Aditya Patil",
    alias: "0xC0ba1t",
  },

  /** Public contact addresses (the two aliases already published on the previous site). */
  email: "main0xc0ba1t@duck.com",
  altEmail: "alt0xc0ba1t@duck.com",
  pgp: { id: "0x556C1CB50E950364", url: "https://github.com/0xC0ba1t.gpg" },

  /**
   * Résumé. Drop a PDF in /public (e.g. public/resume.pdf) and set this to "/resume.pdf".
   * While undefined, the `resume` command explains that it is not configured and
   * no résumé buttons/links are rendered.
   */
  resumeUrl: undefined as string | undefined,

  /** Source repository of this website */
  sourceUrl: "https://github.com/0xC0ba1t/0xc0ba1t.github.io",

  /** Short status line shown in the footer (leave undefined to hide). */
  status: "",
} as const;

export type Site = typeof site;
