export const QR_SESSION_COOKIE = "qr_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(sigBuf);
}

export async function createSessionValue(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(exp);
  return `${payload}.${await sign(payload, secret)}`;
}

export async function isValidSession(
  value: string | undefined,
  secret: string
): Promise<boolean> {
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  if ((await sign(payload, secret)) !== sig) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

// Not a cryptographically perfect constant-time compare, but avoids the
// obvious early-exit timing leak for a single-admin password check.
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
