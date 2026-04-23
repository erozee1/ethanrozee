"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/data/nav";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-sm"
      style={{
        borderColor: "var(--border)",
        background: "rgba(238,239,233,0.92)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          <Image
            src="/image.png"
            alt="Ethan Rozee logo"
            width={20}
            height={20}
            className="w-5 h-5 rounded-sm"
            priority
          />
          erozee1
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded text-xs transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)" }}>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="mailto:ethanrozee01@gmail.com"
            className="px-3 py-1.5 text-xs font-medium rounded border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            Get in touch
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-4 h-0.5" style={{ background: "var(--text-primary)" }} />
          <span className="w-4 h-0.5" style={{ background: "var(--text-primary)" }} />
          <span className="w-4 h-0.5" style={{ background: "var(--text-primary)" }} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-6 py-3 flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-sm"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
