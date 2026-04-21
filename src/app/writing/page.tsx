export default function Writing() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/writing
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Writing
      </h1>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        I write about aerospace, software, and the ideas in between. Posts are published on Medium.
      </p>
      <a
        href="https://medium.com/@ethanrozee01"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text-primary)",
          background: "var(--bg-card)",
          textDecoration: "none",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
        Read on Medium →
      </a>
    </div>
  );
}
