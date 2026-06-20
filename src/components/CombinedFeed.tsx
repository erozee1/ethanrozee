"use client";

import React, { useState } from "react";
import { CommitIcon, ArticleIcon, BookIcon, LinkedInIcon, ChevronIcon, FlagIcon } from "@/components/icons";
import type { ActivityGroup, ActivityItem, Article, Publication, LinkedInPost, ManualPost } from "@/types";

interface Props {
  activityGroups: ActivityGroup[];
  articles: Article[];
  publications: Publication[];
  linkedInPosts: LinkedInPost[];
  manualPosts: ManualPost[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function toMonthLabel(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Parse "Month YYYY" into a numeric ordinal — timezone-independent.
function monthOrdinal(label: string): number {
  const [name, year] = label.split(" ");
  const m = MONTH_NAMES.indexOf(name);
  const y = parseInt(year, 10);
  return isNaN(y) || m < 0 ? 0 : y * 12 + m;
}

function monthToSortKey(label: string): number {
  return monthOrdinal(label);
}

function monthDiff(olderLabel: string, newerLabel: string): number {
  return monthOrdinal(newerLabel) - monthOrdinal(olderLabel);
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
  | { kind: "linkedin"; post: LinkedInPost }
  | { kind: "manual"; post: ManualPost };

type MonthData = { month: string; entries: Entry[] };

type DisplayItem =
  | { kind: "anchor"; data: MonthData }
  // months: data-carrying months to show when expanded
  // label: collapsed summary for empty temporal gaps ("16 months")
  // rangeLabel: "Month YYYY – Month YYYY" used as the expanded button label
  | { kind: "gap"; months: MonthData[]; id: number; label?: string; rangeLabel?: string };

// ── collapsed month summary ───────────────────────────────────────────────────

function CollapsedSummary({ entries }: { entries: Entry[] }) {
  const commitCount = entries
    .filter((e): e is Extract<Entry, { kind: "github" }> => e.kind === "github")
    .reduce((s, e) => s + e.item.repos.reduce((r, repo) => r + repo.commits, 0), 0);
  const articleCount = entries.filter((e) => e.kind === "article").length;
  const pubCount = entries.filter((e) => e.kind === "publication").length;
  const liCount = entries.filter((e) => e.kind === "linkedin").length;
  const manualCount = entries.filter((e) => e.kind === "manual").length;

  const parts: string[] = [];
  if (commitCount > 0) parts.push(`${commitCount} commit${commitCount !== 1 ? "s" : ""}`);
  if (articleCount > 0) parts.push(`${articleCount} article${articleCount !== 1 ? "s" : ""}`);
  if (pubCount > 0) parts.push(`${pubCount} publication${pubCount !== 1 ? "s" : ""}`);
  if (liCount > 0) parts.push(`${liCount} post${liCount !== 1 ? "s" : ""}`);
  if (manualCount > 0) parts.push(`${manualCount} update${manualCount !== 1 ? "s" : ""}`);

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

const manualTypeMeta: Record<ManualPost["type"], { label: string; bg: string; color: string }> = {
  achievement:  { label: "Achievement",  bg: "var(--accent-yellow)", color: "#151515" },
  career:       { label: "Career",       bg: "var(--accent-blue)",   color: "#fff"    },
  project:      { label: "Project",      bg: "var(--accent-green)",  color: "#fff"    },
  event:        { label: "Event",        bg: "var(--accent-red)",    color: "#fff"    },
  announcement: { label: "Announcement", bg: "var(--border-strong)", color: "var(--text-primary)" },
};

function ManualPostEntry({ post }: { post: ManualPost }) {
  const [hovered, setHovered] = useState(false);
  const meta = manualTypeMeta[post.type];
  const titleStyle = {
    color: hovered && post.url ? "var(--accent-blue)" : "var(--text-primary)",
    transition: "color 0.15s",
  };

  return (
    <div>
      {post.url ? (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <p className="text-sm font-semibold mb-2 leading-snug" style={titleStyle}>{post.title}</p>
        </a>
      ) : (
        <p className="text-sm font-semibold mb-2 leading-snug" style={titleStyle}>{post.title}</p>
      )}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <span
            className="inline-flex items-center px-2 h-5 rounded font-semibold shrink-0"
            style={{ background: meta.bg, color: meta.color, fontSize: "10px" }}
          >
            {meta.label}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            {formatDate(post.date)}
          </span>
        </div>
        <div className="px-4 py-3 flex items-start gap-3" style={{ background: "var(--bg)" }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {post.excerpt}
            </p>
            {post.links && post.links.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {post.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
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
      {kind === "manual" && <FlagIcon />}
    </div>
  );
}

// ── entry list renderer ───────────────────────────────────────────────────────

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <>
      {entries.map((entry, i) => (
        <div key={i} className="relative mb-6 pl-10">
          <div className="absolute left-0 top-0">
            <EntryIcon kind={entry.kind} />
          </div>
          {entry.kind === "github" && <GitHubEntry item={entry.item} />}
          {entry.kind === "article" && <ArticleEntry article={entry.article} />}
          {entry.kind === "publication" && <PublicationEntry pub={entry.pub} />}
          {entry.kind === "linkedin" && <LinkedInEntry post={entry.post} />}
          {entry.kind === "manual" && <ManualPostEntry post={entry.post} />}
        </div>
      ))}
    </>
  );
}

// ── month row (anchor months use truncate=true; gap months show all) ──────────

function MonthRow({
  data,
  isExpanded,
  onToggle,
  truncate = false,
}: {
  data: MonthData;
  isExpanded: boolean;
  onToggle: () => void;
  truncate?: boolean;
}) {
  const [showExtra, setShowExtra] = useState(false);
  const { month, entries } = data;
  const spaceIdx = month.indexOf(" ");
  const monthName = month.slice(0, spaceIdx);
  const year = month.slice(spaceIdx + 1);

  // When truncate=true: show the first entry of each kind, collapse the rest.
  let shownEntries = entries;
  let hiddenEntries: Entry[] = [];
  if (truncate) {
    const seen = new Set<string>();
    shownEntries = [];
    hiddenEntries = [];
    for (const entry of entries) {
      if (!seen.has(entry.kind)) {
        shownEntries.push(entry);
        seen.add(entry.kind);
      } else {
        hiddenEntries.push(entry);
      }
    }
  }

  // Build a concise label for the hidden entries button
  const hiddenSummary = (() => {
    const parts: string[] = [];
    const articleCount = hiddenEntries.filter((e) => e.kind === "article").length;
    const commitCount = hiddenEntries
      .filter((e): e is Extract<Entry, { kind: "github" }> => e.kind === "github")
      .reduce((s, e) => s + e.item.repos.reduce((r, repo) => r + repo.commits, 0), 0);
    const pubCount = hiddenEntries.filter((e) => e.kind === "publication").length;
    const liCount = hiddenEntries.filter((e) => e.kind === "linkedin").length;
    const manualCount = hiddenEntries.filter((e) => e.kind === "manual").length;
    if (commitCount > 0) parts.push(`${commitCount} commit${commitCount !== 1 ? "s" : ""}`);
    if (articleCount > 0) parts.push(`${articleCount} article${articleCount !== 1 ? "s" : ""}`);
    if (pubCount > 0) parts.push(`${pubCount} publication${pubCount !== 1 ? "s" : ""}`);
    if (liCount > 0) parts.push(`${liCount} post${liCount !== 1 ? "s" : ""}`);
    if (manualCount > 0) parts.push(`${manualCount} update${manualCount !== 1 ? "s" : ""}`);
    return parts.join("  ·  ");
  })();

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 mb-5 text-left"
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

      {isExpanded && (
        <>
          <EntryList entries={shownEntries} />
          {hiddenEntries.length > 0 && (
            <div className="mb-6 pl-10">
              {showExtra ? (
                <>
                  <EntryList entries={hiddenEntries} />
                  <button
                    onClick={() => setShowExtra(false)}
                    className="text-xs"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)",
                      padding: 0, marginBottom: "16px",
                    }}
                  >
                    hide ↑
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowExtra(true)}
                  className="text-xs flex items-center gap-3"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, marginBottom: "16px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                    {`· · ·  ${hiddenSummary}  · · ·`}
                  </span>
                  <span style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}>
                    show ↓
                  </span>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── gap row ───────────────────────────────────────────────────────────────────

function gapSummaryText(months: MonthData[]): string {
  const allEntries = months.flatMap((m) => m.entries);
  const commitCount = allEntries
    .filter((e): e is Extract<Entry, { kind: "github" }> => e.kind === "github")
    .reduce((s, e) => s + e.item.repos.reduce((r, repo) => r + repo.commits, 0), 0);
  const articleCount = allEntries.filter((e) => e.kind === "article").length;
  const pubCount = allEntries.filter((e) => e.kind === "publication").length;
  const liCount = allEntries.filter((e) => e.kind === "linkedin").length;
  const manualCount = allEntries.filter((e) => e.kind === "manual").length;

  const n = months.length;
  const parts: string[] = [`${n} month${n !== 1 ? "s" : ""}`];
  if (commitCount > 0) parts.push(`${commitCount} commit${commitCount !== 1 ? "s" : ""}`);
  if (articleCount > 0) parts.push(`${articleCount} article${articleCount !== 1 ? "s" : ""}`);
  if (pubCount > 0) parts.push(`${pubCount} publication${pubCount !== 1 ? "s" : ""}`);
  if (liCount > 0) parts.push(`${liCount} post${liCount !== 1 ? "s" : ""}`);
  if (manualCount > 0) parts.push(`${manualCount} update${manualCount !== 1 ? "s" : ""}`);

  return parts.join("  ·  ");
}

function GapRow({
  months,
  label,
  rangeLabel: rangeLabelProp,
  isExpanded,
  onToggle,
  expandedMonths,
  onToggleMonth,
}: {
  months: MonthData[];
  label?: string;
  rangeLabel?: string;
  isExpanded: boolean;
  onToggle: () => void;
  expandedMonths: Set<string>;
  onToggleMonth: (month: string) => void;
}) {
  const hasMonths = months.length > 0;
  const collapsedText = hasMonths ? `· · ·  ${gapSummaryText(months)}  · · ·` : `· · ·  ${label ?? ""}  · · ·`;

  // Expanded button label: date range of the gap content
  const expandedText = hasMonths
    ? (() => {
        const newest = months[0].month;
        const oldest = months[months.length - 1].month;
        return newest === oldest ? newest : `${oldest} – ${newest}`;
      })()
    : (rangeLabelProp ?? label ?? "");

  return (
    <div className="relative mb-6">
      {/* Cover the solid vertical line in this gap section */}
      <div
        style={{
          position: "absolute", left: "13px", top: 0, bottom: 0,
          width: "6px", background: "var(--bg)", zIndex: 1,
        }}
      />
      {/* Dashed replacement line */}
      <div
        style={{
          position: "absolute", left: "15px", top: 0, bottom: 0, width: "2px",
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 10px)",
          zIndex: 2,
        }}
      />

      {/* Toggle button — always shown, even for empty temporal gaps */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 text-left"
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "10px 0", paddingLeft: "40px",
          position: "relative", zIndex: 3,
        }}
      >
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          {isExpanded ? expandedText : collapsedText}
        </span>
        <span
          className="text-xs shrink-0"
          style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
        >
          {isExpanded ? "hide ↑" : "show ↓"}
        </span>
      </button>

      {/* Expanded content — scrollable, max 100vh */}
      {isExpanded && (
        <div style={{ maxHeight: "100vh", overflowY: "auto", position: "relative", zIndex: 3 }}>
          {hasMonths ? (
            months.map(({ month, entries }) => (
              <MonthRow
                key={month}
                data={{ month, entries }}
                isExpanded={expandedMonths.has(month)}
                onToggle={() => onToggleMonth(month)}
              />
            ))
          ) : (
            <p
              className="text-xs pb-4"
              style={{ paddingLeft: "40px", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              No activity during this period.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function CombinedFeed({
  activityGroups,
  articles,
  publications,
  linkedInPosts,
  manualPosts,
}: Props) {
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
  for (const post of manualPosts) add(toMonthLabel(post.date), { kind: "manual", post });

  const sortedGroups: MonthData[] = [...monthMap.entries()]
    .sort((a, b) => monthToSortKey(b[0]) - monthToSortKey(a[0]))
    .map(([month, entries]) => ({ month, entries }));

  // Anchor months: the most recent month containing each content type.
  // These are always shown regardless of how long ago they occurred.
  const anchorMonths = new Set<string>();
  if (activityGroups[0]) anchorMonths.add(activityGroups[0].month);
  if (articles[0]) anchorMonths.add(toMonthLabel(articles[0].date));
  if (publications[0]) anchorMonths.add(toMonthLabel(publications[0].date));
  if (linkedInPosts[0]) anchorMonths.add(toMonthLabel(linkedInPosts[0].date));
  if (manualPosts[0]) anchorMonths.add(toMonthLabel(manualPosts[0].date));

  // Build display sequence: anchor months stay in place; any months with data
  // between two anchors are batched into a gap node.
  const displayItems: DisplayItem[] = [];
  let gapBuffer: MonthData[] = [];
  let gapId = 0;

  for (const data of sortedGroups) {
    if (anchorMonths.has(data.month)) {
      if (gapBuffer.length > 0) {
        displayItems.push({ kind: "gap", months: gapBuffer, id: gapId++ });
        gapBuffer = [];
      }
      displayItems.push({ kind: "anchor", data });
    } else {
      gapBuffer.push(data);
    }
  }
  if (gapBuffer.length > 0) {
    displayItems.push({ kind: "gap", months: gapBuffer, id: gapId++ });
  }

  // Post-process: for consecutive anchor months with no data gap between them,
  // insert a visual-only gap when they're more than 1 calendar month apart.
  const finalDisplayItems: DisplayItem[] = [];
  for (let i = 0; i < displayItems.length; i++) {
    finalDisplayItems.push(displayItems[i]);
    const curr = displayItems[i];
    const next = displayItems[i + 1];
    if (curr?.kind === "anchor" && next?.kind === "anchor") {
      const n = monthDiff(next.data.month, curr.data.month);
      if (n > 1) {
        const lbl = `${n} months`;
        const rl = `${next.data.month} – ${curr.data.month}`;
        finalDisplayItems.push({ kind: "gap", months: [], id: gapId++, label: lbl, rangeLabel: rl });
      }
    }
  }

  // All anchor months start expanded; gap months start collapsed.
  // Hooks must be called before any early returns.
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => new Set(anchorMonths));
  const [expandedGaps, setExpandedGaps] = useState<Set<number>>(new Set());

  if (sortedGroups.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No activity found.
      </p>
    );
  }

  const toggleMonth = (month: string) =>
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      next.has(month) ? next.delete(month) : next.add(month);
      return next;
    });

  const toggleGap = (id: number) =>
    setExpandedGaps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div>
      <h2
        className="text-sm font-semibold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        Contribution activity
      </h2>

      <div className="relative">
        {/* Continuous solid vertical timeline line — gaps overlay it with dashes */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "15px", width: "2px", background: "var(--border)" }}
        />

        {finalDisplayItems.map((item) =>
          item.kind === "anchor" ? (
            <MonthRow
              key={item.data.month}
              data={item.data}
              isExpanded={expandedMonths.has(item.data.month)}
              onToggle={() => toggleMonth(item.data.month)}
              truncate={true}
            />
          ) : (
            <GapRow
              key={`gap-${item.id}`}
              months={item.months}
              label={item.label}
              rangeLabel={item.rangeLabel}
              isExpanded={expandedGaps.has(item.id)}
              onToggle={() => toggleGap(item.id)}
              expandedMonths={expandedMonths}
              onToggleMonth={toggleMonth}
            />
          )
        )}
      </div>
    </div>
  );
}
