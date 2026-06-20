import { fetchArticles } from "@/lib/articles";
import WritingFeed from "@/components/WritingFeed";

export default async function Writing() {
  const articles = await fetchArticles();

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
      <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
        I write about aerospace, software, and the ideas in between. Published on Medium and Substack.
      </p>
      <WritingFeed articles={articles} />
    </div>
  );
}
