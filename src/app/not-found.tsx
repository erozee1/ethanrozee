import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/404
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Page not found
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        This link doesn&apos;t exist or has been disabled.
      </p>
      <Link
        href="/"
        className="inline-block px-3 py-1.5 text-xs font-medium rounded border transition-colors"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        ~/home
      </Link>
    </div>
  );
}
