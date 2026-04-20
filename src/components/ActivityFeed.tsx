"use client";

import { CommitIcon } from "@/components/icons";
import type { ActivityGroup } from "@/types";

interface Props {
  groups: ActivityGroup[];
}

export default function ActivityFeed({ groups }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
        Contribution activity
      </h2>

      {groups.map((group) => (
        <div key={group.month} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {group.month}
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {group.items.map((item, i) => (
            <div key={i} className="flex gap-3 mb-4">
              <div
                className="w-8 h-8 rounded border flex items-center justify-center shrink-0 mt-0.5"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-muted)" }}
              >
                <CommitIcon />
              </div>

              <div className="flex-1 rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
                >
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {item.label}
                  </span>
                </div>

                <div className="px-4 py-3" style={{ background: "var(--bg)" }}>
                  {item.repos.map((repo) => (
                    <div key={repo.name} className="flex items-center gap-3 mb-2 last:mb-0">
                      <span
                        className="text-xs w-44 truncate shrink-0"
                        style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
                      >
                        {repo.name}
                      </span>
                      <span
                        className="text-xs w-16 shrink-0"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                      >
                        {repo.commits} commits
                      </span>
                      <div className="flex-1 h-2 rounded-full" style={{ background: "var(--bg-card)" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${repo.width}%`, background: "var(--accent-green)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
