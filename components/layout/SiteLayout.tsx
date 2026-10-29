import type { ReactNode } from "react";
import { FloatingDock } from "@/components/dock/FloatingDock";
import { PointerGlow } from "@/components/providers/PointerGlow";
import { Footer } from "./Footer";

/** Shared chrome: skip link, ambient glow, content, footer, bottom dock. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PointerGlow />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <main id="main" className="flex-1">
          {children}
        </main>
        <div className="pb-dock">
          <Footer />
        </div>
      </div>
      <FloatingDock />
    </>
  );
}
