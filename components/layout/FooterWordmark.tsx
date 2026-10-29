"use client";

import { TextHoverEffect } from "@/components/typography/TextHoverEffect";
import { features } from "@/config/features";
import { site } from "@/config/site";

/** Large wordmark. The ivory fill is always visible; hover only adds the highlight. */
export function FooterWordmark() {
  if (!features.textHoverEffect) {
    return <p className="display text-6xl text-ivory sm:text-8xl">{site.handle}</p>;
  }
  return (
    <div className="-mx-2 max-w-xl">
      <TextHoverEffect text={site.handle} width={520} height={150} fontSize={120} />
    </div>
  );
}
