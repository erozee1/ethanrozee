import type { Article } from "@/types";

const MEDIUM_FEED = "https://medium.com/feed/@ethanrozee01";
const SUBSTACK_FEED = "https://ethanrozee.substack.com/feed";

function extractCdata(block: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`,
    "i"
  );
  const m = re.exec(block);
  return (m?.[1] ?? m?.[2] ?? "").trim();
}

function extractLink(block: string): string {
  const direct = /<link>([^<]+)<\/link>/i.exec(block);
  if (direct?.[1]?.trim()) return direct[1].trim();
  const href = /<link[^>]+href="([^"]+)"/i.exec(block);
  return href?.[1] ?? "";
}

function extractMediaUrl(block: string): string {
  const content = /<media:content[^>]+url="([^"]+)"/i.exec(block);
  if (content?.[1]) return content[1];
  const thumbnail = /<media:thumbnail[^>]+url="([^"]+)"/i.exec(block);
  if (thumbnail?.[1]) return thumbnail[1];
  // Substack uses <enclosure url="..." type="image/...">
  const enclosure = /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i.exec(block);
  return enclosure?.[1] ?? "";
}

function extractFirstImage(html: string): string {
  const m = /<img[^>]+src="([^"]+)"/i.exec(html);
  return m?.[1] ?? "";
}

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  "&apos;": "'", "&nbsp;": " ", "&mdash;": "—", "&ndash;": "–",
  "&lsquo;": "‘", "&rsquo;": "’", "&ldquo;": "“", "&rdquo;": "”",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&[a-z]+;/gi, (e) => HTML_ENTITIES[e] ?? e);
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function estimateReadTime(html: string): string {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 250));
  return `${mins} min read`;
}

function formatDate(pubDate: string): string {
  const d = new Date(pubDate);
  return isNaN(d.getTime()) ? pubDate : d.toISOString();
}

function parseItems(xml: string, source: "medium" | "substack"): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;

  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];

    const title = stripHtml(extractCdata(block, "title"));
    if (!title) continue;

    const url = extractLink(block);
    if (!url) continue;

    const pubDate = extractCdata(block, "pubDate") || extractCdata(block, "dc:date");
    const date = formatDate(pubDate);

    const descHtml = extractCdata(block, "description");
    const subtitle = stripHtml(descHtml).slice(0, 140) || undefined;

    const contentEncoded = extractCdata(block, "content:encoded");

    const readTime = contentEncoded ? estimateReadTime(contentEncoded) : undefined;

    const imageUrl =
      extractMediaUrl(block) ||
      extractFirstImage(contentEncoded) ||
      undefined;

    items.push({ title, subtitle, date, url, source, readTime, imageUrl });
  }

  return items;
}

async function fetchFeed(url: string, source: "medium" | "substack"): Promise<Article[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml, source);
  } catch {
    return [];
  }
}

export async function fetchArticles(): Promise<Article[]> {
  const [medium, substack] = await Promise.all([
    fetchFeed(MEDIUM_FEED, "medium"),
    fetchFeed(SUBSTACK_FEED, "substack"),
  ]);

  return [...medium, ...substack].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
