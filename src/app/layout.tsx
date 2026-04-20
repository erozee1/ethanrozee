import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethan Rozee",
  description: "Aerospace MEng · Builder · Founder — exploring the intersection of engineering and AI.",
  openGraph: {
    title: "Ethan Rozee",
    description: "Aerospace MEng · Builder · Founder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-6 px-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <span>© {new Date().getFullYear()} Ethan Rozee · Built with Next.js</span>
        </footer>
      </body>
    </html>
  );
}
