import { NextRequest, NextResponse } from "next/server";
import { QR_SESSION_COOKIE, isValidSession } from "@/lib/qrAuth";

export const config = {
  matcher: ["/qr/:path*"],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/qr/login") {
    return NextResponse.next();
  }

  const secret = process.env.QR_SESSION_SECRET;
  const cookie = request.cookies.get(QR_SESSION_COOKIE)?.value;

  if (secret && (await isValidSession(cookie, secret))) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/qr/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
