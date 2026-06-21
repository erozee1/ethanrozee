import type { ActivityGroup } from "@/types";
import { activities as fallbackActivities } from "@/data/activity";

const USERNAME = "erozee1";

// --- types ---------------------------------------------------------------

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

async function graphql(query: string, variables: Record<string, unknown>) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

// --- contribution calendar -----------------------------------------------

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
  try {
    const json = await graphql(CONTRIB_QUERY, { login: USERNAME });
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
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

// --- activity feed -------------------------------------------------------

// Queries per-day commit counts per repo so numbers exactly match GitHub's
// contribution activity page. Falls back to static data without a token.
const ACTIVITY_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository(maxRepositories: 25) {
          repository { nameWithOwner }
          contributions(first: 100) {
            nodes {
              occurredAt
              commitCount
            }
          }
        }
      }
    }
  }
`;

export async function fetchActivityGroups(): Promise<ActivityGroup[]> {
  try {
    // Query the last 12 months
    const to = new Date();
    const from = new Date(to);
    from.setFullYear(from.getFullYear() - 1);

    const json = await graphql(ACTIVITY_QUERY, {
      login: USERNAME,
      from: from.toISOString(),
      to: to.toISOString(),
    });

    const byRepo: { repository: { nameWithOwner: string }; contributions: { nodes: { occurredAt: string; commitCount: number }[] } }[] =
      json?.data?.user?.contributionsCollection?.commitContributionsByRepository ?? [];

    if (byRepo.length === 0) return fallbackActivities;

    // Aggregate: month → repo → total commits
    const byMonth: Record<string, Record<string, number>> = {};

    for (const { repository, contributions } of byRepo) {
      const repoName = repository.nameWithOwner;
      for (const { occurredAt, commitCount } of contributions.nodes) {
        const month = monthLabel(occurredAt.slice(0, 10));
        byMonth[month] ??= {};
        byMonth[month][repoName] = (byMonth[month][repoName] ?? 0) + commitCount;
      }
    }

    if (Object.keys(byMonth).length === 0) return fallbackActivities;

    // Sort months descending (most recent first)
    const sortedMonths = Object.entries(byMonth).sort(([a], [b]) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    return sortedMonths.map(([month, repos]) => {
      const sorted = Object.entries(repos).sort(([, a], [, b]) => b - a);
      const total = sorted.reduce((s, [, c]) => s + c, 0);
      const max = sorted[0]?.[1] ?? 1;

      return {
        month,
        items: [
          {
            label: `${total} commit${total !== 1 ? "s" : ""} across ${sorted.length} repositor${sorted.length !== 1 ? "ies" : "y"}`,
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
