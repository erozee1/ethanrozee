import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { qrDataUrl } from "@/lib/qr";
import { siteUrl } from "@/lib/site";
import { deleteCode } from "@/app/qr/actions";
import DeleteCodeButton from "@/components/DeleteCodeButton";

export const dynamic = "force-dynamic";

export default async function QrDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = supabaseAdmin();

  const { data: code } = await supabase
    .from("codes")
    .select("id, slug, label, destination_url, active, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!code) notFound();

  const { data: scans } = await supabase
    .from("scans")
    .select("id, scanned_at, user_agent, referrer")
    .eq("code_id", code.id)
    .order("scanned_at", { ascending: false })
    .limit(200);

  const shortUrl = `${siteUrl}/r/${code.slug}`;
  const dataUrl = await qrDataUrl(shortUrl);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/qr"
        className="text-xs mb-6 inline-block"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
      >
        ← ~/qr
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        <div
          className="shrink-0 rounded-xl border p-4"
          style={{ borderColor: "var(--border-strong)", background: "#fff" }}
        >
          <Image
            src={dataUrl}
            alt={`QR code for ${code.label}`}
            width={176}
            height={176}
            unoptimized
            className="block rounded-md"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            {code.label}
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            {shortUrl}
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>→ {code.destination_url}</p>
          <div className="flex items-center gap-3 mt-1">
            <a
              href={dataUrl}
              download={`${code.slug}.png`}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium w-fit"
              style={{
                borderColor: "var(--border-strong)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-geist-mono)",
                textDecoration: "none",
              }}
            >
              Download PNG
            </a>
            <DeleteCodeButton
              action={deleteCode.bind(null, code.id)}
              label={code.label}
              className="text-xs hover:underline"
            />
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        {scans?.length ?? 0} scan{(scans?.length ?? 0) === 1 ? "" : "s"}
      </h2>

      {!scans || scans.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No scans yet.
        </p>
      ) : (
        <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-3 py-2 font-normal">Time</th>
                <th className="text-left px-3 py-2 font-normal">Referrer</th>
                <th className="text-left px-3 py-2 font-normal">User agent</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(s.scanned_at).toLocaleString()}</td>
                  <td className="px-3 py-2 truncate max-w-[200px]">{s.referrer || "—"}</td>
                  <td className="px-3 py-2 truncate max-w-[300px]">{s.user_agent || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
