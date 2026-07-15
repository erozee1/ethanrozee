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

export async function createCode(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const destination = String(formData.get("destination_url") ?? "").trim();
  if (!label || !destination) return;

  let url: URL;
  try {
    url = new URL(destination);
  } catch {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const supabase = supabaseAdmin();
  await supabase.from("codes").insert({
    slug: randomSlug(),
    label,
    destination_url: url.toString(),
  });

  revalidatePath("/qr");
}

export async function toggleActive(id: string, active: boolean) {
  const supabase = supabaseAdmin();
  await supabase.from("codes").update({ active }).eq("id", id);
  revalidatePath("/qr");
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
