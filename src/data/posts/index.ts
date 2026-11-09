import type { ManualPost } from "@/types";

// Add your timeline updates here. See README.md for field descriptions and
// template.json for a copy-paste starting point.
//
// Posts are sorted by date and merged into the homepage contribution timeline
// alongside GitHub activity, writing, research, and LinkedIn posts.
export const manualPosts: ManualPost[] = [
  {
    id: "nfcc-oprr-2026-steggo-demo",
    title: "Live Steggo demo at the NFCC OPRR Conference",
    date: "2026-10-08",
    type: "event",
    excerpt:
      "Exhibited Steggo at the National Fire Chiefs Council's Operational Preparedness, Response and Resilience Conference, live-demoing radio intelligence for incident commanders.",
    url: "https://www.steggo.ai/",
    links: [{ label: "Steggo", url: "https://www.steggo.ai/" }],
  },
  {
    id: "antler-backed-2026-steggo",
    title: "Steggo is officially Antler-backed",
    date: "2026-09-30",
    type: "achievement",
    excerpt:
      "After the Antler programme, Steggo secured backing from Antler to build radio intelligence for commanders.",
    url: "https://www.steggo.ai/",
    imageUrl: "/antler-logo.png",
  },
  {
    id: "edth-hackathon-2026-win",
    title: "Won EDTH Hackathon",
    date: "2026-06-28",
    type: "achievement",
    excerpt:
      "Won EDTH with a mission-planning system that fused live OSINT feeds and spoken field reports into a shared threat map for safer routing.",
    url: "https://github.com/erozee1/EDTH---Hack",
    links: [
      { label: "GitHub", url: "https://github.com/erozee1/EDTH---Hack" },
      { label: "Live API", url: "https://edth-hack.onrender.com/docs" },
    ],
    imageUrl: "/edth-hackathon-win.jpg",
  },
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
