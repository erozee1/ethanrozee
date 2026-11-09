import type { Badge, SocialLink } from "@/types";
import { GitHubIcon, LinkedInIcon, LinkIcon } from "@/components/icons";

export const badges: Badge[] = [
  { label: "Aerospace MEng", emoji: "🛩️" },
  { label: "Co-founder, Steggo", emoji: "🦕" },
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
    href: "https://www.linkedin.com/in/ethan-rozeee/",
    icon: <LinkedInIcon />,
  },
  {
    label: "Steggo",
    href: "https://www.steggo.ai/",
    icon: <LinkIcon />,
  },
];
