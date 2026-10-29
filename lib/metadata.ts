import type { Metadata } from "next";
import { site } from "@/config/site";

interface PageMeta {
  title?: string;
  description?: string;
  /** root-relative path with trailing slash, e.g. "/projects/" */
  path: string;
}

/** Build per-page metadata with canonical URL, Open Graph and Twitter cards. */
export function createMetadata({ title, description, path }: PageMeta): Metadata {
  const fullTitle = title ? site.titleTemplate.replace("%s", title) : site.title;
  const desc = description ?? site.description;
  const url = `${site.url}${path}`;
  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description: desc,
      siteName: site.title,
      locale: site.locale,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: ["/og.png"],
    },
  };
}
