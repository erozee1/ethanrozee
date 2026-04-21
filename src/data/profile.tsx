import type { Badge, SocialLink } from "@/types";
import { GitHubIcon, LinkedInIcon, LinkIcon } from "@/components/icons";

export const badges: Badge[] = [
  { label: "Aerospace MEng", emoji: "🛩️" },
  { label: "Open to founders", emoji: "🤝" },
  { label: "London / Remote", emoji: "📍" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/erozee1",
    icon: <GitHubIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ethan-rozee-965997216/",
    icon: <LinkedInIcon />,
  },
  {
    label: "www.getdeltar.com",
    href: "https://www.getdeltar.com",
    icon: <LinkIcon />,
  },
];
