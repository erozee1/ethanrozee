"use client";

import Image from "next/image";
import { badges, socialLinks } from "@/data/profile";

export default function ProfileSidebar() {
  return (
    <aside className="md:w-64 shrink-0">
      <div className="mb-5">
        <div
          className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 mx-auto md:mx-0"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <Image
            src="/ethan-rozee.jpeg"
            alt="Ethan Rozee"
            width={256}
            height={256}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
      </div>

      <div className="mb-4 text-center md:text-left">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          Ethan Rozee
        </h1>
        <p
          className="text-base mt-0.5"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontWeight: 300 }}
        >
          erozee1
        </p>
      </div>

      <p className="text-sm leading-relaxed mb-5 text-center md:text-left" style={{ color: "var(--text-secondary)" }}>
        An Aerospace MEng student trying to find the problem to work on.
      </p>

      <a
        href="mailto:ethanrozee01@gmail.com"
        className="block w-full text-center text-sm font-medium py-1.5 px-4 rounded-lg border mb-5 transition-colors"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text-primary)",
          background: "var(--bg-card)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
        }}
      >
        Get in touch
      </a>

      <div className="flex flex-wrap gap-1.5 mb-5 justify-center md:justify-start">
        {badges.map((b) => (
          <span
            key={b.label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "var(--bg-card)",
            }}
          >
            <span>{b.emoji}</span>
            {b.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs transition-colors"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>{s.icon}</span>
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
