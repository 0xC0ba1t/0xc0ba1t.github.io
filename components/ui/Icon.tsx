import { Briefcase, FileText, Home, Layers, Mail, Palette, User, Wrench, type LucideIcon } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import type { IconName } from "@/config/navigation";

/** Maps the icon names used in config/navigation.ts to Lucide icons. */
const icons: Record<IconName, LucideIcon | typeof IconBrandGithub> = {
  home: Home,
  user: User,
  projects: Layers,
  skills: Wrench,
  experience: Briefcase,
  contact: Mail,
  github: IconBrandGithub,
  resume: FileText,
  theme: Palette,
};

export function Icon({ name, className, size = 20 }: { name: IconName; className?: string; size?: number }) {
  const C = icons[name] as React.ComponentType<{ className?: string; size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  return <C className={className} size={size} strokeWidth={1.6} aria-hidden />;
}
