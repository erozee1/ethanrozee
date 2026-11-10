import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Hit daily by the Vercel cron in vercel.json. Supabase pauses Free plan
// projects after ~7 days without database activity, which would 404 every
// printed QR code, so this runs one real query a day to count as activity.
// Vercel sends `Authorization: Bearer $CRON_SECRET` on cron invocations.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin().from("codes").select("id").limit(1);

  if (error) {
    // Non-2xx so the failed run shows up in Vercel's cron/function logs.
    console.error("Supabase keepalive failed:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
