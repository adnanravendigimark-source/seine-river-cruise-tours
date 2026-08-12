import { sql } from "./db";
import type { ContentBlock } from "./posts";
import privacyPolicySeed from "@/data/privacy-policy.json";

export interface PrivacyPolicy {
  title: string;
  lastUpdated: string;
  content: ContentBlock[];
  // Search Engine Indexing toggle (admin-editable). false (default) =
  // indexable (index, follow). true = noindex, nofollow. See lib/seo.ts.
  noIndex: boolean;
  noFollow: boolean;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

function parseContent(value: unknown): ContentBlock[] {
  if (Array.isArray(value)) return value as ContentBlock[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Fallback shown if the database is unreachable or hasn't been seeded yet
// (`node scripts/setup-db.mjs`) — the real Seine River Cruise Tours privacy
// policy baked into data/privacy-policy.json. This is a starting template,
// not legal advice; have a lawyer review it (especially for GDPR/CCPA)
// before relying on it.
const DEFAULT_PRIVACY_POLICY: PrivacyPolicy = {
  title: (privacyPolicySeed as any).title || "Privacy Policy",
  lastUpdated: new Date().toISOString().slice(0, 10),
  content: (privacyPolicySeed as any).content || [],
  noIndex: false,
  noFollow: false,
  canonicalUrl: "",
  metaTitle: "Privacy Policy | Seine River Cruise Tours",
  metaDescription: "Privacy Policy for Seine River Cruise Tours — how we collect, use, and protect your information.",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

export async function getPrivacyPolicy(): Promise<PrivacyPolicy> {
  try {
    const rows = await sql`SELECT * FROM privacy_policy WHERE id = 1 LIMIT 1`;
    if (!rows.length) return DEFAULT_PRIVACY_POLICY;
    const row = rows[0] as any;
    return {
      title: row.title || DEFAULT_PRIVACY_POLICY.title,
      lastUpdated: row.last_updated || DEFAULT_PRIVACY_POLICY.lastUpdated,
      content: parseContent(row.content),
      noIndex: !!row.no_index,
      noFollow: !!row.no_follow,
      canonicalUrl: row.canonical_url || "",
      metaTitle: row.meta_title || DEFAULT_PRIVACY_POLICY.metaTitle,
      metaDescription: row.meta_description || DEFAULT_PRIVACY_POLICY.metaDescription,
      ogTitle: row.og_title || "",
      ogDescription: row.og_description || "",
      ogImage: row.og_image || "",
    };
  } catch {
    return DEFAULT_PRIVACY_POLICY;
  }
}

// Touches ONLY the indexing columns — used by the centralized "Indexing"
// admin tab (/admin/indexing).
export async function setPrivacyIndexing(noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`
    INSERT INTO privacy_policy (id, no_index, no_follow)
    VALUES (1, ${!!noIndex}, ${!!noFollow})
    ON CONFLICT (id) DO UPDATE SET
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow
  `;
}

export async function savePrivacyPolicy(data: {
  title: string;
  content: ContentBlock[];
  noIndex: boolean;
  noFollow: boolean;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}): Promise<void> {
  const lastUpdated = new Date().toISOString().slice(0, 10);
  await sql`
    INSERT INTO privacy_policy (
      id, title, last_updated, content, no_index, no_follow, canonical_url,
      meta_title, meta_description, og_title, og_description, og_image
    )
    VALUES (
      1, ${data.title}, ${lastUpdated}, ${JSON.stringify(data.content || [])}::jsonb, ${!!data.noIndex}, ${!!data.noFollow},
      ${data.canonicalUrl || ""}, ${data.metaTitle || ""}, ${data.metaDescription || ""},
      ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      last_updated = EXCLUDED.last_updated,
      content = EXCLUDED.content,
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow,
      canonical_url = EXCLUDED.canonical_url,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image
  `;
}
