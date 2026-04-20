import type { ActivityGroup } from "@/types";
import { activities as fallbackActivities } from "@/data/activity";

const USERNAME = "erozee1";

// --- types ---------------------------------------------------------------

interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    size?: number;           // present with GITHUB_TOKEN; commit count for the push
    commits?: { sha: string }[];
  };
  created_at: string;
}

export interface ContribDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

export interface ContribData {
  total: number;
  weeks: ContribDay[][];
}

// --- helpers -------------------------------------------------------------

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function levelFromString(s: string): 0 | 1 | 2 | 3 | 4 {
  const map: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return map[s] ?? 0;
}

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

// --- contribution calendar (requires GITHUB_TOKEN) -----------------------

const CONTRIB_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export async function fetchContribData(): Promise<ContribData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: CONTRIB_QUERY, variables: { login: USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    const weeks: ContribDay[][] = calendar.weeks.map(
      (week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: levelFromString(day.contributionLevel),
        }))
    );

    return { total: calendar.totalContributions, weeks };
  } catch {
    return null;
  }
}

// --- activity feed (works without auth, 60 req/hr unauthenticated) -------

export async function fetchActivityGroups(): Promise<ActivityGroup[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/events?per_page=100`,
      { headers: authHeaders(), next: { revalidate: 3600 } }
    );

    if (!res.ok) return fallbackActivities;

    const events: GitHubEvent[] = await res.json();

    const pushEvents = events.filter((e) => e.type === "PushEvent");

    // Aggregate: month → repo → count
    // `size` is only present with a token; fall back to counting 1 per PushEvent
    const hasExactCounts = pushEvents.some((e) => typeof e.payload.size === "number");
    const byMonth: Record<string, Record<string, number>> = {};

    for (const event of pushEvents) {
      const month = monthLabel(event.created_at.slice(0, 10));
      const repo = event.repo.name;
      const count = event.payload.size ?? event.payload.commits?.length ?? 1;

      byMonth[month] ??= {};
      byMonth[month][repo] = (byMonth[month][repo] ?? 0) + count;
    }

    if (Object.keys(byMonth).length === 0) return fallbackActivities;

    const unit = hasExactCounts ? "commit" : "push";

    return Object.entries(byMonth).map(([month, repos]) => {
      const sorted = Object.entries(repos).sort(([, a], [, b]) => b - a);
      const total = sorted.reduce((s, [, c]) => s + c, 0);
      const max = sorted[0]?.[1] ?? 1;

      return {
        month,
        items: [
          {
            label: `${total} ${unit}${total !== 1 ? "s" : ""} across ${sorted.length} repositor${sorted.length !== 1 ? "ies" : "y"}`,
            repos: sorted.map(([name, commits]) => ({
              name,
              commits,
              width: Math.round((commits / max) * 90),
            })),
          },
        ],
      };
    });
  } catch {
    return fallbackActivities;
  }
}
