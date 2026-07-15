"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

function randomSlug(length = 6): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous chars
  let s = "";
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function parseDestinationUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}

export async function createCode(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const destination = parseDestinationUrl(String(formData.get("destination_url") ?? ""));
  if (!label || !destination) return;

  const supabase = supabaseAdmin();
  await supabase.from("codes").insert({
    slug: randomSlug(),
    label,
    destination_url: destination,
  });

  revalidatePath("/qr");
}

export async function toggleActive(id: string, active: boolean) {
  const supabase = supabaseAdmin();
  await supabase.from("codes").update({ active }).eq("id", id);
  revalidatePath("/qr");
}

// The whole point of a dynamic QR code: the printed/shared code never
// changes, only where it resolves to. This is the "point of entry" for
// repointing an existing code without touching the code itself.
export async function updateDestination(id: string, slug: string, formData: FormData) {
  const destination = parseDestinationUrl(String(formData.get("destination_url") ?? ""));
  if (!destination) return;

  const supabase = supabaseAdmin();
  await supabase.from("codes").update({ destination_url: destination }).eq("id", id);
  revalidatePath("/qr");
  revalidatePath(`/qr/${slug}`);
}

// Deletes the code and (via ON DELETE CASCADE) its scan history. Always
// redirects back to /qr, so this works whether it's called from the list
// or from a code's own detail page.
export async function deleteCode(id: string) {
  const supabase = supabaseAdmin();
  await supabase.from("codes").delete().eq("id", id);
  revalidatePath("/qr");
  redirect("/qr");
}
