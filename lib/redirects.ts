import { sql } from "./db";

// Backs the "renaming a post's URL automatically redirects the old
// address" feature in /admin/posts. Deliberately a separate table rather
// than a column on `posts` — a post only ever needs its *current* slug,
// but the site needs to remember every *previous* slug it ever had, for
// as long as old links/rankings might still point at it.
//
// Chains are flattened on write: if /a was already redirecting to /b, and
// /b is now renamed to /c, this updates the /a row to point straight at
// /c instead of leaving a two-hop chain (/a → /b → /c) that would only
// ever get followed one hop at a time by whatever reads this table.
export async function recordSlugRename(oldSlug: string, newSlug: string): Promise<void> {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  try {
    await sql`
      INSERT INTO post_redirects (old_slug, new_slug) VALUES (${oldSlug}, ${newSlug})
      ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug, created_at = now()
    `;
    await sql`UPDATE post_redirects SET new_slug = ${newSlug} WHERE new_slug = ${oldSlug} AND old_slug != ${newSlug}`;
  } catch {
    // Table may not exist yet on a database that hasn't run the latest
    // `node scripts/setup-db.mjs` — fail soft, same policy as the rest of
    // this app when the schema is behind the code.
  }
}

// Looked up from the public /blog/[slug] route whenever a slug 404s —
// returns the slug's *current* address if this used to be a published
// post's URL, so it can issue a permanent redirect instead of a 404.
export async function getRedirectTarget(oldSlug: string): Promise<string | undefined> {
  try {
    const rows = await sql`SELECT new_slug FROM post_redirects WHERE old_slug = ${oldSlug} LIMIT 1`;
    return rows.length ? (rows[0].new_slug as string) : undefined;
  } catch {
    return undefined;
  }
}

export interface PostRedirectRow {
  oldSlug: string;
  newSlug: string;
  createdAt: string;
}

// Read-only list for the "Redirects" info panel in the post editor's
// Advanced SEO tab, so an SEO specialist can see what's already in place
// without needing database access.
export async function getAllRedirects(): Promise<PostRedirectRow[]> {
  try {
    const rows = await sql`SELECT old_slug, new_slug, created_at FROM post_redirects ORDER BY created_at DESC`;
    return rows.map((r) => ({
      oldSlug: r.old_slug as string,
      newSlug: r.new_slug as string,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : "",
    }));
  } catch {
    return [];
  }
}
