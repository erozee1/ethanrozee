import type { ActivityGroup } from "@/types";

export const activities: ActivityGroup[] = [
  {
    month: "April 2026",
    items: [
      {
        label: "Created 61 commits in 5 repositories",
        repos: [
          { name: "erozee1/deltarapi", commits: 21, width: 90 },
          { name: "erozee1/paragonAI", commits: 17, width: 72 },
          { name: "erozee1/deltar", commits: 15, width: 60 },
          { name: "erozee1/AAS-Retrieval", commits: 4, width: 20 },
          { name: "erozee1/mango-costs", commits: 4, width: 20 },
        ],
      },
    ],
  },
  {
    month: "March 2026",
    items: [
      {
        label: "Opened 3 pull requests in 2 repositories",
        repos: [
          { name: "erozee1/bomkit", commits: 2, width: 60 },
          { name: "erozee1/rozee-sdk", commits: 1, width: 30 },
        ],
      },
    ],
  },
];
