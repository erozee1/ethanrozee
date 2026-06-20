"use client";

import { useState } from "react";
import { ArticleIcon } from "@/components/icons";
import type { Article } from "@/types";

interface Props {
  articles: Article[];
}

function toMonthLabel(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function SourceBadge({ source }: { source: "medium" | "substack" }) {
  const isMedium = source === "medium";
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold shrink-0"
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

function ArticleItem({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      {/* Title — GitHub-style headline sitting above the detail card */}
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
          style={{
            color: hovered ? "var(--accent-blue)" : "var(--text-primary)",
            transition: "color 0.15s",
          }}
        >
          {article.title}
        </p>
      </a>

      {/* Detail card */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {/* Metadata bar */}
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
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            {formatDisplayDate(article.date)}
          </span>
          {article.readTime && (
            <>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
              >
                {article.readTime}
              </span>
            </>
          )}
        </div>

        {/* Subtitle + thumbnail */}
        {(article.subtitle || article.imageUrl) && (
          <div
            className="px-4 py-3 flex items-start gap-3"
            style={{ background: "var(--bg)" }}
          >
            {article.subtitle && (
              <p
                className="flex-1 text-xs leading-relaxed line-clamp-2"
                style={{ color: "var(--text-muted)" }}
              >
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

export default function WritingFeed({ articles }: Props) {
  const groups: { month: string; items: Article[] }[] = [];
  for (const article of articles) {
    const month = toMonthLabel(article.date);
    const last = groups[groups.length - 1];
    if (last?.month === month) {
      last.items.push(article);
    } else {
      groups.push({ month, items: [article] });
    }
  }

  if (groups.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        No articles found.
      </p>
    );
  }

  return (
    <div>
      <h2
        className="text-sm font-semibold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        Published writing
      </h2>

      {/* Timeline container — the vertical line runs through everything */}
      <div className="relative">
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "15px", width: "2px", background: "var(--border)" }}
        />

        {groups.map((group) => {
          const spaceIdx = group.month.indexOf(" ");
          const monthName = group.month.slice(0, spaceIdx);
          const year = group.month.slice(spaceIdx + 1);

          return (
            <div key={group.month} className="mb-8">
              {/* Month header — same left offset as items, no icon */}
              <div className="flex items-center gap-2 mb-5 pl-10">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {monthName}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {year}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              {group.items.map((article, i) => (
                <div key={i} className="relative mb-6 pl-10">
                  {/* Circle badge — sits on the vertical line */}
                  <div
                    className="absolute left-0 top-0 w-8 h-8 rounded-full border flex items-center justify-center"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <ArticleIcon />
                  </div>

                  <ArticleItem article={article} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
