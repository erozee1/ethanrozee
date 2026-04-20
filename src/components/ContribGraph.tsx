"use client";

import type { ContribData } from "@/lib/github";

// Seeded PRNG fallback — shown when GITHUB_TOKEN is not set
function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0x7fffffff;
  };
}

function buildFallbackCells(): number[][] {
  const rand = seedRand(42);
  return Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => {
      const r = rand();
      if (r < 0.45) return 0;
      if (r < 0.65) return 1;
      if (r < 0.80) return 2;
      if (r < 0.92) return 3;
      return 4;
    })
  );
}

interface Props {
  data: ContribData | null;
}

export default function ContribGraph({ data }: Props) {
  const cells: number[][] = data
    ? data.weeks.map((week) => week.map((d) => d.level))
    : buildFallbackCells();

  const total = data?.total ?? 617;

  // Derive month labels from real data, or use static fallback
  const monthLabels: string[] = (() => {
    if (!data) return ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    const seen = new Set<string>();
    const labels: string[] = [];
    for (const week of data.weeks) {
      const first = week[0];
      if (!first) { labels.push(""); continue; }
      const m = new Date(first.date + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
      if (!seen.has(m)) { seen.add(m); labels.push(m); }
      else labels.push("");
    }
    return labels;
  })();

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {total.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div style={{ minWidth: "660px" }}>
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="text-xs flex-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "10px" }}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-2 pt-0.5">
              {dayLabels.map((d, i) => (
                <div
                  key={i}
                  style={{ height: "13px", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "9px", display: "flex", alignItems: "center" }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-0.5">
              {cells.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((level, di) => {
                    const day = data?.weeks[wi]?.[di];
                    return (
                      <div
                        key={di}
                        className="contrib-cell"
                        data-level={level}
                        title={day ? `${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}` : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1 mt-2 justify-end">
            <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className="contrib-cell" data-level={l} />
            ))}
            <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
