import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { site } from "@/config/site";
import { defaultThemeId, themeBootScript, themeCss, themes } from "@/config/theme";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: site.titleTemplate },
  description: site.description,
  authors: [{ name: site.author.name, url: site.url }],
  alternates: { canonical: `${site.url}/` },
  openGraph: {
    type: "website",
    url: `${site.url}/`,
    siteName: site.title,
    title: site.title,
    description: site.description,
    locale: site.locale,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.title }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: themes.find((t) => t.id === defaultThemeId)?.tokens.obsidian,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="dark" data-theme={defaultThemeId} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript() }} />
        {/* Content must stay visible when JavaScript is off */}
        <noscript>
          <style>{`[style*="opacity: 0"],[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider>
          <SiteLayout>{children}</SiteLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
