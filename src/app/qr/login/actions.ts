"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QR_SESSION_COOKIE, createSessionValue, timingSafeEqual } from "@/lib/qrAuth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/qr");
  const adminPassword = process.env.QR_ADMIN_PASSWORD;
  const secret = process.env.QR_SESSION_SECRET;

  if (!adminPassword || !secret || !timingSafeEqual(password, adminPassword)) {
    redirect(`/qr/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(QR_SESSION_COOKIE, await createSessionValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next.startsWith("/qr") ? next : "/qr");
}

export async function logout() {
  const store = await cookies();
  store.delete(QR_SESSION_COOKIE);
  redirect("/qr/login");
}
