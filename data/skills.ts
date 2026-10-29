import type { SkillGroup } from "@/lib/types";

/**
 * Only things supported by the CV, the previous site or the GitHub profile.
 * No proficiency bars: a skill is either listed or it isn't.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "ai-ml",
    title: "AI and machine learning",
    blurb: "Building, training and having fun exploring models in Python",
    items: [
      "PyTorch",
      "NumPy",
      "Matplotlib",
      "OpenCV",
      "Stable diffusion (prettyprint)",
      "Small language models (SnapdragonLLM)",
      "Computer vision",
      "Reinforcement learning basics",
      "Model Context Protocol",
    ],
  },
  {
    id: "languages",
    title: "Programming languages",
    items: ["Python", "Rust", "C", "C++", "Go", "TypeScript", "JavaScript", "Bash", "PowerShell", "x86 assembly", "SQL"],
  },
  {
    id: "systems",
    title: "Systems programming",
    items: ["Rust", "C and C++", "Assembly", "Operating-system development (zero)", "MicroPython"],
  },
  {
    id: "web",
    title: "Web development",
    items: ["HTML", "CSS", "React", "Vite", "Next.js", "Tailwind CSS", "Apache", "Nginx"],
  },
  {
    id: "hardware",
    title: "Hardware and computer architecture",
    items: ["Arduino", "Raspberry Pi", "Espressif microcontrollers", "Robotics electronics", "Marty and mBot robots"],
  },
  {
    id: "infra",
    title: "Infrastructure and self-hosting",
    items: ["Linux (Arch)", "Proxmox", "Unraid", "Docker", "WireGuard", "Tailscale"],
  },
  {
    id: "security",
    title: "Networking and security",
    items: ["Firewalls (Sophos)", "VPNs and remote access", "Active Directory", "Network troubleshooting", "Tor"],
  },
  {
    id: "tools",
    title: "Developer tools",
    items: ["Git and GitHub", "GitHub Actions", "Neovim", "Vim", "VS Code", "CMake", "LaTeX"],
  },
  {
    id: "databases",
    title: "Databases",
    items: ["MySQL", "PostgreSQL", "SQLite", "MongoDB"],
  },
];
