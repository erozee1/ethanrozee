import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = supabaseAdmin();

  const { data: code } = await supabase
    .from("codes")
    .select("id, destination_url, active")
    .eq("slug", slug)
    .maybeSingle();

  if (!code || !code.active) {
    notFound();
  }

  // Fire-and-forget: don't make the scanner wait on the log write.
  void supabase
    .from("scans")
    .insert({
      code_id: code.id,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })
    .then(() => {});

  return NextResponse.redirect(code.destination_url, { status: 302 });
}
