"use client";

import Link from "next/link";
import { StarIcon } from "@/components/icons";
import type { WorkItem } from "@/types";

export default function ProjectCard({
  name,
  description,
  category,
  categoryColor,
  stars = 0,
  href,
  tags,
}: WorkItem) {
  const isExternal = href?.startsWith("http");
  const Wrapper = href ? (isExternal ? "a" : Link) : "div";

  return (
    <Wrapper
      href={href as string}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block rounded-lg border p-4 transition-colors"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-card)",
        cursor: href ? "pointer" : "default",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--accent-blue)", letterSpacing: "-0.01em" }}
        >
          {name}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full border ml-2 shrink-0"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)", fontSize: "10px" }}
        >
          Public
        </span>
      </div>

      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>

      <div className="flex items-center gap-5 flex-wrap">
        {tags ? (
          tags.map((tag) => (
            <div key={tag.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: tag.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                {tag.label}
              </span>
              {tag.stars != null && tag.stars > 0 && (
                <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <StarIcon />
                  <span className="text-xs" style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {tag.stars}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: categoryColor }} />
              <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                {category}
              </span>
            </div>
            {stars > 0 && (
              <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <StarIcon />
                <span className="text-xs" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {stars}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
}
