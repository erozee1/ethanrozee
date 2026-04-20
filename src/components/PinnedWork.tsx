"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { WorkItem } from "@/types";

const DEFAULT_VISIBLE = 4;

interface PinnedWorkProps {
  items: WorkItem[];
}

export default function PinnedWork({ items }: PinnedWorkProps) {
  const [expanded, setExpanded] = useState(false);

  const sorted = [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const visible = expanded ? sorted : sorted.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = sorted.length - DEFAULT_VISIBLE;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          Pinned
        </h2>
        {hiddenCount > 0 && (
          <button
            className="text-xs px-2 py-1 rounded border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--accent-blue)", background: "transparent" }}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `Show all ${sorted.length}`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((item) => (
          <ProjectCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
