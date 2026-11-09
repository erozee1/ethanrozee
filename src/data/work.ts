import type { WorkItem } from "@/types";

export const workItems: WorkItem[] = [
  {
    id: "founder",
    name: "Steggo",
    description: "Co-founder & engineer. Radio intelligence for commanders: live radio traffic turned into one shared, source-linked incident picture, running on device. Antler-backed.",
    category: "Founder",
    categoryColor: "#F54E00",
    updatedAt: "2026-10-08",
    href: "https://www.steggo.ai/",
  },
  {
    id: "code-projects",
    name: "Code projects",
    description: "Won EDTH. Built Darwn and ThinkedIn at London hackathons. Production AI platform serving 18 teams across 3 countries, plus OSS for BOM tooling, AAS and macOS.",
    category: "Engineering",
    categoryColor: "#3FB950",
    updatedAt: "2026-06-28",
    href: "/projects",
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
