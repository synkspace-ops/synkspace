import { useCallback, useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Health = { ok?: boolean; service?: string };

export default function HomePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [healthErr, setHealthErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CREATOR" | "BRAND" | "ORGANISER">("CREATOR");
  const [name, setName] = useState("");
  const [waitlistMsg, setWaitlistMsg] = useState<string | null>(null);
  const [waitlistErr, setWaitlistErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadHealth = useCallback(async () => {
    setHealthErr(null);
    try {
      const r = await fetch(`${apiBase}/health`);
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const j = (await r.json()) as Health;
      setHealth(j);
    } catch (e) {
      setHealth(null);
      setHealthErr(e instanceof Error ? e.message : "Could not reach API");
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistMsg(null);
    setWaitlistErr(null);
    setSubmitting(true);
    try {
      const r = await fetch(`${apiBase}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });
      const j = (await r.json()) as { message?: string; error?: string };
      if (!r.ok) throw new Error(j.error ?? j.message ?? r.statusText);
      setWaitlistMsg(j.message ?? "Success");
      setEmail("");
      setName("");
    } catch (e) {
      setWaitlistErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  const apiOk = health?.ok === true;

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Local dev</p>
        <h1>Sync</h1>
        <p className="lede">
          Frontend + API running together. Below, the UI talks to your Fastify backend on{" "}
          <code>{apiBase}</code>.
        </p>
      </header>

      <section className="card">
        <h2>API status</h2>
        <p className="hint">
          <button type="button" className="linkish" onClick={() => void loadHealth()}>
            Refresh
          </button>
        </p>
        {healthErr && (
          <p className="banner error">
            <strong>Offline.</strong> {healthErr} — start the API with <code>npm run dev</code> in the
            repo root (and Docker for Postgres/Redis if needed).
          </p>
        )}
        {apiOk && (
          <p className="banner ok">
            <strong>Connected.</strong> <code>/health</code> returned{" "}
            <code>{JSON.stringify(health)}</code>
          </p>
        )}
        {!healthErr && !apiOk && health && (
          <p className="banner">Unexpected response: {JSON.stringify(health)}</p>
        )}
      </section>

      <section className="card">
        <h2>Join waitlist</h2>
        <p className="hint">POST <code>/api/waitlist</code> — requires DB tables (run <code>npx prisma db push</code>).</p>
        <form onSubmit={(e) => void onSubmit(e)} className="form">
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
              <option value="CREATOR">Creator</option>
              <option value="BRAND">Brand</option>
              <option value="ORGANISER">Organiser</option>
            </select>
          </label>
          <label>
            Name <span className="optional">(optional)</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
          </label>
          <button type="submit" disabled={submitting || !apiOk}>
            {submitting ? "Sending…" : "Submit"}
          </button>
        </form>
        {waitlistMsg && <p className="banner ok">{waitlistMsg}</p>}
        {waitlistErr && <p className="banner error">{waitlistErr}</p>}
      </section>

      <footer className="foot">
        <span>Vite dev server →</span> <a href="http://localhost:5173">http://localhost:5173</a>
        <span className="sep">·</span>
        <span>API →</span> <a href={apiBase}>{apiBase}</a>
      </footer>
    </div>
  );
}
