import Image from "next/image";
import Link from "next/link";
import { qrDataUrl } from "@/lib/qr";
import { siteUrl } from "@/lib/site";
import { toggleActive } from "@/app/qr/actions";

interface QrCardProps {
  code: {
    id: string;
    slug: string;
    label: string;
    destination_url: string;
    active: boolean;
    scanCount: number;
  };
}

export default async function QrCard({ code }: QrCardProps) {
  const dataUrl = await qrDataUrl(`${siteUrl}/r/${code.slug}`);

  return (
    <div
      className="rounded-lg border p-4 flex gap-4"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div
        className="shrink-0 rounded-md border p-1.5"
        style={{ borderColor: "var(--border-strong)", background: "#fff" }}
      >
        <Image
          src={dataUrl}
          alt={`QR code for ${code.label}`}
          width={80}
          height={80}
          unoptimized
          className="block rounded-sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/qr/${code.slug}`}
            className="text-sm font-semibold truncate"
            style={{ color: "var(--accent-blue)" }}
          >
            {code.label}
          </Link>
          <span
            className="text-xs px-2 py-0.5 rounded-full border shrink-0"
            style={{
              borderColor: "var(--border-strong)",
              color: code.active ? "var(--accent-green)" : "var(--text-muted)",
              fontSize: "10px",
            }}
          >
            {code.active ? "Active" : "Disabled"}
          </span>
        </div>
        <p className="text-xs truncate mb-2" style={{ color: "var(--text-secondary)" }}>
          {code.destination_url}
        </p>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          <span>
            {code.scanCount} scan{code.scanCount === 1 ? "" : "s"}
          </span>
          <a
            href={dataUrl}
            download={`${code.slug}.png`}
            className="hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            download
          </a>
          <form action={toggleActive.bind(null, code.id, !code.active)}>
            <button type="submit" className="hover:underline" style={{ color: "var(--text-muted)" }}>
              {code.active ? "disable" : "enable"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
