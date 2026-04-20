export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/contact
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Contact
      </h1>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Reach out directly — I&apos;m always open to interesting conversations.
      </p>
      <a
        href="mailto:ethanrozee01@gmail.com"
        className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text-primary)",
          background: "var(--bg-card)",
          textDecoration: "none",
        }}
      >
        ethanrozee01@gmail.com
      </a>
    </div>
  );
}
