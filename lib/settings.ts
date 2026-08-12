import { sql } from "./db";

// Per-page "Search Engine Indexing" toggle for the handful of public pages
// that don't have their own CMS-editable row elsewhere. Blog posts, the
// homepage, and the Privacy Policy each store their own `no_index` column
// directly on their own table (see lib/posts.ts, lib/homepage.ts,
// lib/legal.ts) — About, Contact, and the Blog listing don't have a
// dedicated table, so they share this one singleton settings row instead.
// Defaults to false (indexable) for all three, same as every other page.
export interface PageIndexingSettings {
  aboutNoIndex: boolean;
  contactNoIndex: boolean;
  blogNoIndex: boolean;
}

const DEFAULT_SETTINGS: PageIndexingSettings = {
  aboutNoIndex: false,
  contactNoIndex: false,
  blogNoIndex: false,
};

export async function getPageIndexingSettings(): Promise<PageIndexingSettings> {
  try {
    const rows = await sql`SELECT * FROM site_settings WHERE id = 1 LIMIT 1`;
    if (!rows.length) return DEFAULT_SETTINGS;
    const row = rows[0] as any;
    return {
      aboutNoIndex: !!row.about_no_index,
      contactNoIndex: !!row.contact_no_index,
      blogNoIndex: !!row.blog_no_index,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function savePageIndexingSettings(data: PageIndexingSettings): Promise<void> {
  await sql`
    INSERT INTO site_settings (id, about_no_index, contact_no_index, blog_no_index)
    VALUES (1, ${!!data.aboutNoIndex}, ${!!data.contactNoIndex}, ${!!data.blogNoIndex})
    ON CONFLICT (id) DO UPDATE SET
      about_no_index = EXCLUDED.about_no_index,
      contact_no_index = EXCLUDED.contact_no_index,
      blog_no_index = EXCLUDED.blog_no_index
  `;
}
