import { publications } from "@/data/research";
import { BookIcon } from "@/components/icons";
import type { Publication } from "@/types";

const typeLabels: Record<Publication["type"], string> = {
  conference: "Conference Paper",
  journal: "Journal Article",
  thesis: "Thesis",
};

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function PublicationCard({ pub }: { pub: Publication }) {
  const cardClass = "block rounded-lg border p-5";
  const cardStyle = { borderColor: "var(--border)", background: "var(--bg-card)", textDecoration: "none" };

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4 mb-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold shrink-0"
          style={{ background: "var(--accent-yellow)", color: "#151515" }}
        >
          {typeLabels[pub.type]}
        </span>
        <span
          className="text-xs shrink-0"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          {formatDate(pub.date)}
        </span>
      </div>
      <h3 className="text-sm font-semibold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
        {pub.title}
      </h3>
      <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
        {pub.authors.join(", ")}
      </p>
      <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
        {pub.venue}
      </p>
      {pub.abstract && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {pub.abstract}
        </p>
      )}
      {pub.doi && (
        <p className="text-xs mt-3" style={{ color: "var(--accent-blue)", fontFamily: "var(--font-geist-mono)" }}>
          {pub.doi}
        </p>
      )}
    </>
  );

  if (pub.url) {
    return (
      <a href={pub.url} target="_blank" rel="noopener noreferrer" className={cardClass} style={cardStyle}>
        {inner}
      </a>
    );
  }
  return <div className={cardClass} style={cardStyle}>{inner}</div>;
}

export default function Research() {
  const order: Publication["type"][] = ["journal", "conference", "thesis"];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/research
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Research
      </h1>
      <p className="text-sm leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
        Aerospace Engineering research at the University of Nottingham, exploring the intersection
        of AI and physical engineering systems.
      </p>

      {publications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg border"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <BookIcon size={24} />
          <p className="text-sm mt-4">Publications coming soon.</p>
        </div>
      ) : (
        order.map((type) => {
          const items = publications
            .filter((p) => p.type === type)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          if (items.length === 0) return null;
          return (
            <div key={type} className="mb-10">
              <h2
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
              >
                {typeLabels[type]}s
              </h2>
              <div className="flex flex-col gap-4">
                {items.map((pub, i) => <PublicationCard key={i} pub={pub} />)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
