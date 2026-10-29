import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { SkillsOverview } from "@/components/sections/SkillsOverview";
import { Activities } from "@/components/sections/Activities";
import { ContactCta } from "@/components/sections/ContactCta";
import { TerminalShowcase } from "@/components/sections/TerminalShowcase";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <TerminalShowcase />
      <FeaturedProjects />
      <SkillsOverview />
      <Activities />
      <ContactCta />
    </>
  );
}
