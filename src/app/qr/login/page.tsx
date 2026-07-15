import { login } from "./actions";

export default async function QrLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-6">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}>
          ~/qr/login
        </span>
        <span style={{ color: "var(--border-strong)" }}>▊</span>
      </div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
        Admin sign in
      </h1>

      <form action={login} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next ?? "/qr"} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
          }}
        />
        {error && (
          <p className="text-xs" style={{ color: "var(--accent-red)" }}>
            Incorrect password.
          </p>
        )}
        <button
          type="submit"
          className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
          style={{
            borderColor: "var(--border-strong)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
