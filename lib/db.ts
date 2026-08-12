import { neon } from "@neondatabase/serverless";

// Neon's HTTP-based driver — each `sql` call is a single stateless HTTP
// request, which is what makes it safe to use from serverless functions
// (Vercel) without exhausting a connection pool the way a normal
// long-lived Postgres client would.
//
// Requires a DATABASE_URL env var pointing at your Neon connection string
// (Neon dashboard → Connection Details → "Pooled connection" string).
// Set it in .env locally, and in your Vercel project's Settings →
// Environment Variables for production. Until it's set, every read below
// fails soft and falls back to the real starter content baked into /data
// (see lib/data.ts, lib/posts.ts, lib/homepage.ts, lib/legal.ts) — writes
// from /admin will show DB_ERROR_MESSAGE until DATABASE_URL is configured.
if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set — reads fall back to the starter content in /data, and every content write will fail until it's configured."
  );
}

// IMPORTANT: neon()'s HTTP driver executes every query as an internal
// fetch() call. Next.js's App Router automatically caches server-side
// fetch() calls unless a call explicitly opts out — and neon's internal
// fetch doesn't do that on its own. Without `fetchOptions: { cache:
// "no-store" }` here, Next.js can silently cache the *database query
// responses themselves*: a write (INSERT/UPDATE) still reaches Neon and
// succeeds, but a subsequent read can be served from Next.js's cached
// copy of an *older* query response instead of hitting Neon again — so
// admin saves report success but the "new" content never appears, no
// matter how many browser/CDN/router caching layers are disabled (this
// bit is a distinct, server-internal cache those don't touch at all).
export const sql = neon(process.env.DATABASE_URL || "postgres://unset", {
  fetchOptions: { cache: "no-store" },
});

// Shown to the admin (instead of a raw crash) when a save fails because
// the database couldn't be reached or rejected the query — e.g. DATABASE_URL
// missing/wrong, or the Neon project is paused/unreachable.
export const DB_ERROR_MESSAGE =
  "Couldn't save — the database couldn't be reached. Check that DATABASE_URL is set correctly (and that your Neon project is active), then try again.";

// Same idea as DB_ERROR_MESSAGE, but for the specific case where the
// database IS reachable and rejects the query because a column or table
// this feature needs doesn't exist yet — i.e. `node scripts/setup-db.mjs`
// hasn't been run against it since the schema last changed. Without this,
// that failure looked identical to a generic connectivity problem, which
// made it impossible to tell the two apart from the error message alone —
// e.g. the homepage/site-settings "Search Engine Indexing" toggle failing
// to save with a generic "Save failed" every time, with no way to tell
// whether that meant "DATABASE_URL is wrong" or "the no_index column/
// site_settings table doesn't exist yet on this database."
export function dbErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/column .* does not exist|relation .* does not exist/i.test(message)) {
    return "Couldn't save — the database is missing a column or table this feature needs. Run `node scripts/setup-db.mjs` against this database (see README), then try again.";
  }
  return DB_ERROR_MESSAGE;
}
