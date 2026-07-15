import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key. RLS on codes/scans denies
// anon/authenticated access entirely (see supabase/migrations/0001_qr_codes.sql),
// so this must never be imported from client components.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
