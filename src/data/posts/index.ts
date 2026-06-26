import type { ManualPost } from "@/types";

// Add your timeline updates here. See README.md for field descriptions and
// template.json for a copy-paste starting point.
//
// Posts are sorted by date and merged into the homepage contribution timeline
// alongside GitHub activity, writing, research, and LinkedIn posts.
export const manualPosts: ManualPost[] = [
  {
    id: "cursor-hands-off-2026-darwn",
    title: "Cursor Hands-Off London hackathon",
    date: "2026-06-25",
    type: "event",
    excerpt:
      "Built Darwn at the Cursor Hands-Off hackathon — a fully autonomous, evolutionary grant agency. It finds open UK grants, matches companies to them, and runs a Darwinian competition between specialist agents to write the best application. The fittest agent wins and its lineage evolves.",
    url: "https://github.com/erozee1/cursor-hands-off",
    links: [
      { label: "GitHub", url: "https://github.com/erozee1/cursor-hands-off" },
    ],
  },
  {
    id: "pop-the-bubble-2026-thinkedin",
    title: "Pop the Bubble hackathon",
    date: "2026-06-07",
    type: "event",
    excerpt:
      "Participated in a 36-hour hackathon in London and built thinkedin — talk to your LinkedIn network in one prompt.",
    url: "https://getthinkedin.xyz",
    links: [
      { label: "thinkedin", url: "https://getthinkedin.xyz" },
      { label: "GitHub", url: "https://github.com/erozee1/ThinkedIn" },
    ],
  },
];
