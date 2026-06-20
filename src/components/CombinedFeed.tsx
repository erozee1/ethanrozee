"use client";

import { useState } from "react";
import { CommitIcon, ArticleIcon, BookIcon, LinkedInIcon, ChevronIcon } from "@/components/icons";
import type { ActivityGroup, ActivityItem, Article, Publication, LinkedInPost } from "@/types";

interface Props {
  activityGroups: ActivityGroup[];
  articles: Article[];
  publications: Publication[];
  linkedInPosts: LinkedInPost[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function toMonthLabel(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function monthToSortKey(label: string): number {
  return new Date(label).getTime();
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// ── entry types ───────────────────────────────────────────────────────────────

type Entry =
  | { kind: "github"; item: ActivityItem }
  | { kind: "article"; article: Article }
  | { kind: "publication"; pub: Publication }
  | { kind: "linkedin"; post: LinkedInPost };

// ── collapsed month summary ───────────────────────────────────────────────────

function CollapsedSummary({ entries }: { entries: Entry[] }) {
  const commitCount = entries
    .filter((e): e is Extract<Entry, { kind: "github" }> => e.kind === "github")
    .reduce((s, e) => s + e.item.repos.reduce((r, repo) => r + repo.commits, 0), 0);
  const articleCount = entries.filter((e) => e.kind === "article").length;
  const pubCount = entries.filter((e) => e.kind === "publication").length;
  const liCount = entries.filter((e) => e.kind === "linkedin").length;

  const parts: string[] = [];
  if (commitCount > 0) parts.push(`${commitCount} commit${commitCount !== 1 ? "s" : ""}`);
  if (articleCount > 0) parts.push(`${articleCount} article${articleCount !== 1 ? "s" : ""}`);
  if (pubCount > 0) parts.push(`${pubCount} publication${pubCount !== 1 ? "s" : ""}`);
  if (liCount > 0) parts.push(`${liCount} post${liCount !== 1 ? "s" : ""}`);

  return (
    <span
      className="text-xs"
      style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
    >
      {parts.join("  ·  ")}
    </span>
  );
}

// ── sub-renderers ─────────────────────────────────────────────────────────────

function GitHubEntry({ item }: { item: ActivityItem }) {
  return (
    <div>
      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {item.label}
      </p>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
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
  );
}

function SourceBadge({ source }: { source: "medium" | "substack" }) {
  const isMedium = source === "medium";
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded font-bold shrink-0"
      style={{
        background: isMedium ? "var(--accent-blue)" : "var(--accent-yellow)",
        color: isMedium ? "#fff" : "#151515",
        fontSize: "10px",
      }}
    >
      {isMedium ? "M" : "S"}
    </span>
  );
}

function PubTypeBadge({ type }: { type: Publication["type"] }) {
  const labels = { conference: "Conference", journal: "Journal", thesis: "Thesis" };
  return (
    <span
      className="inline-flex items-center px-2 h-5 rounded font-semibold shrink-0"
      style={{ background: "var(--accent-yellow)", color: "#151515", fontSize: "10px" }}
    >
      {labels[type]}
    </span>
  );
}

function ArticleEntry({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p
          className="text-sm font-semibold mb-2 leading-snug"
          style={{ color: hovered ? "var(--accent-blue)" : "var(--text-primary)", transition: "color 0.15s" }}
        >
          {article.title}
        </p>
      </a>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <SourceBadge source={article.source} />
          <span
            className="text-xs capitalize"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
          >
            {article.source}
          </span>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            {formatDate(article.date)}
          </span>
          {article.readTime && (
            <>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                {article.readTime}
              </span>
            </>
          )}
        </div>
        {(article.subtitle || article.imageUrl) && (
          <div className="px-4 py-3 flex items-start gap-3" style={{ background: "var(--bg)" }}>
            {article.subtitle && (
              <p className="flex-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {article.subtitle}
              </p>
            )}
            {article.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt=""
                className="w-12 h-12 rounded object-cover shrink-0"
                style={{ border: "1px solid var(--border)" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PublicationEntry({ pub }: { pub: Publication }) {
  const [hovered, setHovered] = useState(false);
  const titleStyle = {
    color: hovered && pub.url ? "var(--accent-blue)" : "var(--text-primary)",
    transition: "color 0.15s",
  };

  return (
    <div>
      {pub.url ? (
        <a
          href={pub.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <p className="text-sm font-semibold mb-2 leading-snug" style={titleStyle}>{pub.title}</p>
        </a>
      ) : (
        <p className="text-sm font-semibold mb-2 leading-snug" style={titleStyle}>{pub.title}</p>
      )}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <PubTypeBadge type={pub.type} />
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            {formatDate(pub.date)}
          </span>
          {pub.doi && (
            <>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                {pub.doi}
              </span>
            </>
          )}
        </div>
        <div className="px-4 py-3" style={{ background: "var(--bg)" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
            {pub.authors.join(", ")}
          </p>
          <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
            {pub.venue}
          </p>
          {pub.abstract && (
            <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
              {pub.abstract}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkedInEntry({ post }: { post: LinkedInPost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p
          className="text-sm font-semibold mb-2 leading-snug"
          style={{ color: hovered ? "var(--accent-blue)" : "var(--text-primary)", transition: "color 0.15s" }}
        >
          {post.title}
        </p>
      </a>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0"
            style={{ background: "#0A66C2", color: "#fff" }}
          >
            <LinkedInIcon size={12} />
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
          >
            LinkedIn
          </span>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            {formatDate(post.date)}
          </span>
        </div>
        <div className="px-4 py-3 flex items-start gap-3" style={{ background: "var(--bg)" }}>
          <p className="flex-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>
          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              alt=""
              className="w-12 h-12 rounded object-cover shrink-0"
              style={{ border: "1px solid var(--border)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EntryIcon({ kind }: { kind: Entry["kind"] }) {
  return (
    <div
      className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
      style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-muted)" }}
    >
      {kind === "github" && <CommitIcon />}
      {kind === "article" && <ArticleIcon />}
      {kind === "publication" && <BookIcon />}
      {kind === "linkedin" && <LinkedInIcon />}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function CombinedFeed({ activityGroups, articles, publications, linkedInPosts }: Props) {
  // Build unified month → entries map
  const monthMap = new Map<string, Entry[]>();

  const add = (month: string, entry: Entry) => {
    const arr = monthMap.get(month) ?? [];
    arr.push(entry);
    monthMap.set(month, arr);
  };

  for (const group of activityGroups) {
    for (const item of group.items) add(group.month, { kind: "github", item });
  }
  for (const article of articles) add(toMonthLabel(article.date), { kind: "article", article });
  for (const pub of publications) add(toMonthLabel(pub.date), { kind: "publication", pub });
  for (const post of linkedInPosts) add(toMonthLabel(post.date), { kind: "linkedin", post });

  const groups = [...monthMap.entries()]
    .sort((a, b) => monthToSortKey(b[0]) - monthToSortKey(a[0]))
    .map(([month, entries]) => ({ month, entries }));

  // Smart default: expand most recent GitHub month + most recent article month
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => {
    const auto = new Set<string>();
    if (activityGroups.length > 0) auto.add(activityGroups[0].month);
    if (articles.length > 0) auto.add(toMonthLabel(articles[0].date));
    return auto;
  });

  const toggleMonth = (month: string) =>
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });

  if (groups.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No activity found.
      </p>
    );
  }

  return (
    <div>
      <h2
        className="text-sm font-semibold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        Contribution activity
      </h2>

      <div className="relative">
        {/* Continuous vertical timeline line */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "15px", width: "2px", background: "var(--border)" }}
        />

        {groups.map(({ month, entries }) => {
          const isExpanded = expandedMonths.has(month);
          const spaceIdx = month.indexOf(" ");
          const monthName = month.slice(0, spaceIdx);
          const year = month.slice(spaceIdx + 1);

          return (
            <div key={month} className="mb-6">
              {/* Month header — always visible, always clickable */}
              <button
                onClick={() => toggleMonth(month)}
                className="w-full flex items-center gap-2 mb-5 pl-10 text-left"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, paddingLeft: "40px" }}
              >
                <span style={{ color: "var(--text-muted)", flexShrink: 0, display: "flex", alignItems: "center" }}>
                  <ChevronIcon size={12} down={isExpanded} />
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", flexShrink: 0 }}>
                  {monthName}
                </span>
                <span className="text-sm" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  {year}
                </span>
                {isExpanded ? (
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                ) : (
                  <>
                    <span style={{ color: "var(--border-strong)", fontSize: "10px", flexShrink: 0 }}>·</span>
                    <CollapsedSummary entries={entries} />
                  </>
                )}
              </button>

              {/* Entries — only rendered when expanded */}
              {isExpanded && entries.map((entry, i) => (
                <div key={i} className="relative mb-6 pl-10">
                  <div className="absolute left-0 top-0">
                    <EntryIcon kind={entry.kind} />
                  </div>

                  {entry.kind === "github" && <GitHubEntry item={entry.item} />}
                  {entry.kind === "article" && <ArticleEntry article={entry.article} />}
                  {entry.kind === "publication" && <PublicationEntry pub={entry.pub} />}
                  {entry.kind === "linkedin" && <LinkedInEntry post={entry.post} />}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
