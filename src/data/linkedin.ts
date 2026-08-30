import type { LinkedInPost } from "@/types";

// Add LinkedIn posts here manually — LinkedIn has no public RSS or API for
// personal profiles. Paste the post URL, a short title, an excerpt, and the
// date it was published.
export const linkedInPosts: LinkedInPost[] = [
  {
    title: "Steggo accepted into Antler",
    excerpt:
      "Four days into Antler, we made it official: Steggo joined the programme, with four weeks to turn months of learning into something undeniable.",
    date: "2026-08-27",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7498707262044131328/",
    imageUrl: "/antler-logo.png",
  },
  {
    title: "Demonstrated Steggo v0 at EDT Festival in Berlin",
    excerpt:
      "Took Steggo's v0 to Berlin for four days of demonstrations, pitching, and conversations with users at EDT Festival.",
    date: "2026-08-21",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7496595566811025408/",
  },
  {
    title: "Validated Steggo's direction in Ukraine",
    excerpt:
      "Met users and partners in Ukraine, challenged our assumptions, and returned with a sharper direction for Steggo as a wartime decision-making company.",
    date: "2026-08-11",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7492917104002797568/",
  },
];
