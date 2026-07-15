import { supabaseAdmin } from "@/lib/supabase";
import { createCode } from "./actions";
import { logout } from "./login/actions";
import QrCard from "@/components/QrCard";

export const dynamic = "force-dynamic";

interface CodeRow {
  id: string;
  slug: string;
  label: string;
  destination_url: string;
  active: boolean;
  created_at: string;
}

async function getCodes(): Promise<(CodeRow & { scanCount: number })[]> {
  let supabase;
  try {
    supabase = supabaseAdmin();
  } catch {
    return [];
  }

  const { data: codes } = await supabase
    .from("codes")
    .select("id, slug, label, destination_url, active, created_at")
    .order("created_at", { ascending: false });

  if (!codes || codes.length === 0) return [];

  const { data: scans } = await supabase.from("scans").select("code_id");

  const counts = new Map<string, number>();
  for (const s of scans ?? []) {
    counts.set(s.code_id, (counts.get(s.code_id) ?? 0) + 1);
  }

  return codes.map((c) => ({ ...c, scanCount: counts.get(c.id) ?? 0 }));
}

export default async function QrDashboard() {
  const codes = await getCodes();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}
          >
            ~/qr
          </span>
          <span style={{ color: "var(--border-strong)" }}>▊</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs px-2 py-1 rounded border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            sign out
          </button>
        </form>
      </div>

      <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        QR Codes
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Create a code, point it at a URL, and track scans.
      </p>

      <form
        action={createCode}
        className="flex flex-col sm:flex-row gap-2 mb-10 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <input
          type="text"
          name="label"
          placeholder="Label (e.g. Business card)"
          required
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-primary)" }}
        />
        <input
          type="url"
          name="destination_url"
          placeholder="https://destination.example.com"
          required
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-primary)" }}
        />
        <button
          type="submit"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
          style={{
            borderColor: "var(--border-strong)",
            background: "var(--bg)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Create
        </button>
      </form>

      {codes.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No codes yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {codes.map((code) => (
            <QrCard key={code.id} code={code} />
          ))}
        </div>
      )}
    </div>
  );
}
