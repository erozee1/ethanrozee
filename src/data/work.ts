import type { WorkItem } from "@/types";

export const workItems: WorkItem[] = [
  {
    id: "founder",
    name: "Deltar",
    description: "Founder & CEO. Building The Intelligence Layer for Engineering Change.",
    category: "Founder",
    categoryColor: "#F54E00",
    updatedAt: "2026-04-18",
    href: "https://www.getdeltar.com",
  },
  {
    id: "code-projects",
    name: "Code projects",
    description: "Production AI platform serving 18 teams across 3 countries. OSS spanning BOM tooling, AAS utilities, and macOS apps.",
    category: "Engineering",
    categoryColor: "#3FB950",
    updatedAt: "2026-04-15",
    href: "https://github.com/erozee1",
    tags: [
      { label: "Engineering", color: "#3FB950" },
      { label: "OSS", color: "#1D4AFF", stars: 3 },
    ],
  },
  {
    id: "research",
    name: "MEng Research",
    description: "Aerospace Engineering at UoN. Exploring the intersection of AI and physical engineering systems.",
    category: "Research",
    categoryColor: "#F1A82C",
    updatedAt: "2026-03-20",
    href: "/research",
  },
  {
    id: "writing",
    name: "Essays & Writing",
    description: "Long-form writing on AI, startups, and aerospace. Thinking out loud about technology and what it means to build.",
    category: "Writing",
    categoryColor: "#8957E5",
    updatedAt: "2026-03-01",
    href: "/writing",
  },
];
