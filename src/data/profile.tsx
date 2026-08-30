import type { Badge, SocialLink } from "@/types";
import { GitHubIcon, LinkedInIcon, LinkIcon } from "@/components/icons";

export const badges: Badge[] = [
  { label: "Aerospace MEng", emoji: "🛩️" },
  { label: "Founder & Engineer", emoji: "🦕" },
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
    label: "Steggo at Antler",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7498707262044131328/",
    icon: <LinkIcon />,
  },
];
