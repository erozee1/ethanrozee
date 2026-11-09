import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/projects
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Projects
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Hackathon builds and open-source tools.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)", textDecoration: "none" }}
          >
            <h2
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}
            >
              {p.name}
            </h2>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              {p.description}
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.languageColor }} />
                {p.language}
              </span>
              {p.stars ? <span>★ {p.stars}</span> : null}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
