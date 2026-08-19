import { sql } from "./db";
import postsSeed from "@/data/posts.json";

// A post's body is a simple list of typed blocks rather than raw HTML/
// Markdown — easy for a non-technical content writer to edit in the admin
// UI (one editor per block) and easy to render safely without a parser.
// "paragraph" blocks store their own HTML (from RichTextEditor — bold,
// italic, links, lists, tables, and even inline images can all live inside
// a single paragraph block), "heading" is plain text with a level so the
// page only ever gets one real H1 (the post title) and every in-body
// heading is a proper H2/H3, "list" is a simple one-item-per-line list,
// and "image" is a dedicated full-width photo block for breaking up long
// sections.
export type ContentBlockType = "paragraph" | "heading" | "list" | "image";

export interface ContentBlock {
  type: ContentBlockType;
  text?: string; // paragraph (HTML from RichTextEditor) / heading (plain text)
  level?: 2 | 3; // heading only — defaults to 2 when absent
  items?: string[]; // list
  ordered?: boolean; // list only — defaults to false (bullet list)
  src?: string; // image only
  alt?: string; // image only
  caption?: string; // image only
}

export interface Post {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  excerpt: string;
  quickAnswer: string;
  readTime: string;
  date: string;
  // Set automatically on every save — used for the Article schema's
  // dateModified and the sitemap's lastModified, so both stay accurate
  // without the admin having to remember to touch anything.
  updatedAt: string;
  image: string;
  imageAlt: string;
  recommendedTourId: string;
  // Whether the "Recommended Tour" widget renders under the article body,
  // right before the closing CTA. Stored as a number for backward
  // compatibility with the old per-block placement (any value > 0 = show;
  // 0/undefined = don't show) — the admin UI now only exposes a checkbox.
  recommendedTourAfterBlock?: number;
  // The full article body as one HTML string from RichTextEditor — bold,
  // italic, headings, links, lists, tables, and inline images all live
  // together in this single field, same as every other rich-text field in
  // the admin (FAQ answers, tour descriptions, etc).
  content: string;
  // The closing "Ready to book?" callout box — admin-editable per post,
  // falls back to the site's original hardcoded copy (via rowToPost /
  // seedPosts) so every post published before this existed keeps looking
  // exactly the same until someone actually edits it.
  ctaHeading: string;
  ctaBody: string;
  ctaButtonText: string;
  ctaButtonHref: string;
  // The phrase this post is trying to rank for — purely a writing aid for
  // the on-page checklist in the admin UI, never sent anywhere public.
  focusKeyword: string;
  // Search Engine Indexing toggle (admin-editable, per post). false (the
  // default) = indexable (index, follow). true = noindex, nofollow. See
  // lib/seo.ts for how this combines with the site-wide toggle.
  noIndex: boolean;
  // Independent "Link Following" toggle — see lib/seo.ts's resolveRobots.
  noFollow: boolean;
  // Blank = auto-generate from SITE_URL + "/blog/{slug}".
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const DEFAULT_CTA_HEADING = "Ready to book?";
const DEFAULT_CTA_BODY = "Compare cruise prices and tickets on the homepage.";
const DEFAULT_CTA_BUTTON_TEXT = "See Price Comparison";
const DEFAULT_CTA_BUTTON_HREF = "/#prices";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Converts a post that was written under the old "list of blocks" editor
// into a single HTML string, so it opens and displays correctly in the new
// one-page continuous editor without anyone having to re-type it. Runs
// automatically on read — the DB row itself isn't touched until that post
// is next saved, at which point it's written back out as a plain string.
function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "heading") {
        const level = block.level === 3 ? 3 : 2;
        return `<h${level}>${escapeHtml(block.text || "")}</h${level}>`;
      }
      if (block.type === "list") {
        const tag = block.ordered ? "ol" : "ul";
        const items = (block.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
      }
      if (block.type === "image") {
        if (!block.src) return "";
        const img = `<img src="${block.src}" alt="${escapeHtml(block.alt || "")}" />`;
        return block.caption
          ? `<figure>${img}<figcaption>${escapeHtml(block.caption)}</figcaption></figure>`
          : `<figure>${img}</figure>`;
      }
      // paragraph blocks already store their own HTML from RichTextEditor.
      return block.text || "";
    })
    .filter(Boolean)
    .join("");
}

// A post's content column holds one of two shapes depending on when it was
// last saved: an array of the old typed blocks (heading/paragraph/list/
// image), or — for every post saved since the editor became one continuous
// field — a plain HTML string. Both are normalized to a string here so the
// rest of the app never has to think about the old format again.
function parseContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return blocksToHtml(value as ContentBlock[]);
  return "";
}

function rowToPost(row: any): Post {
  return {
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    category: row.category,
    excerpt: row.excerpt,
    quickAnswer: row.quick_answer,
    readTime: row.read_time,
    date: row.date,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : row.date,
    image: row.image,
    imageAlt: row.image_alt,
    recommendedTourId: row.recommended_tour_id || "",
    recommendedTourAfterBlock:
      row.recommended_tour_after_block === null ? undefined : Number(row.recommended_tour_after_block),
    content: parseContent(row.content),
    ctaHeading: row.cta_heading || DEFAULT_CTA_HEADING,
    ctaBody: row.cta_body || DEFAULT_CTA_BODY,
    ctaButtonText: row.cta_button_text || DEFAULT_CTA_BUTTON_TEXT,
    ctaButtonHref: row.cta_button_href || DEFAULT_CTA_BUTTON_HREF,
    focusKeyword: row.focus_keyword || "",
    noIndex: !!row.no_index,
    noFollow: !!row.no_follow,
    canonicalUrl: row.canonical_url || "",
    ogTitle: row.og_title || "",
    ogDescription: row.og_description || "",
    ogImage: row.og_image || "",
  };
}

function seedPosts(): Post[] {
  return (postsSeed as any[]).map((p) => ({
    ...p,
    content: parseContent(p.content),
    updatedAt: p.updatedAt || p.date,
    ctaHeading: p.ctaHeading || DEFAULT_CTA_HEADING,
    ctaBody: p.ctaBody || DEFAULT_CTA_BODY,
    ctaButtonText: p.ctaButtonText || DEFAULT_CTA_BUTTON_TEXT,
    ctaButtonHref: p.ctaButtonHref || DEFAULT_CTA_BUTTON_HREF,
    focusKeyword: p.focusKeyword || "",
    noIndex: !!p.noIndex,
    noFollow: !!p.noFollow,
    canonicalUrl: p.canonicalUrl || "",
    ogTitle: p.ogTitle || "",
    ogDescription: p.ogDescription || "",
    ogImage: p.ogImage || "",
  }));
}

export async function getPosts(): Promise<Post[]> {
  try {
    // Newest publish date first — posts have no manual drag-to-reorder UI
    // (unlike tours), so `sort_order` here is just insertion order, which
    // meant every newly published post silently landed at the very end of
    // the list (last card in the grid, never the featured post) no matter
    // how recent it was. Sorting by date instead means a new post always
    // becomes the featured article at the top of /blog, which is what
    // "publishing a post" should actually do.
    const rows = await sql`SELECT * FROM posts ORDER BY date DESC, sort_order ASC`;
    return rows.map(rowToPost);
  } catch {
    // DB unreachable (e.g. first run before setup-db.mjs has ever connected) -
    // fall back to seed content. An empty table is a valid, intentional state
    // (admin deleted every post) and must NOT fall back here.
    return seedPosts();
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  try {
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} LIMIT 1`;
    return rows.length ? rowToPost(rows[0]) : undefined;
  } catch {
    return seedPosts().find((p) => p.slug === slug);
  }
}

// Touches ONLY the indexing columns for one post — used by the
// centralized "Indexing" admin tab (/admin/indexing) so flipping a post's
// Index/Follow toggle there can never clobber the rest of that post's
// content, no matter which was saved most recently.
export async function setPostIndexing(slug: string, noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`UPDATE posts SET no_index = ${!!noIndex}, no_follow = ${!!noFollow} WHERE slug = ${slug}`;
}

export async function getRelatedPosts(slug: string, count?: number): Promise<Post[]> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  return typeof count === "number" ? filtered.slice(0, count) : filtered;
}

// Replaces the full post list with exactly the given records — upserts
// everything passed in, then removes any row not present in `posts`. This
// matches how the admin API routes already call it (read the full list,
// apply one change, pass the whole thing back). A slug rename is just
// "the new slug isn't in the old list" — the old row gets deleted here and
// a new one inserted; the API route is responsible for recording that as a
// redirect (lib/redirects.ts) before calling this.
export async function savePosts(posts: Post[]): Promise<void> {
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await sql`
      INSERT INTO posts (
        slug, title, meta_title, meta_description, category, excerpt,
        quick_answer, read_time, date, updated_at, image, image_alt,
        recommended_tour_id, recommended_tour_after_block, content, sort_order,
        cta_heading, cta_body, cta_button_text, cta_button_href, focus_keyword,
        no_index, no_follow, canonical_url, og_title, og_description, og_image
      ) VALUES (
        ${p.slug}, ${p.title}, ${p.metaTitle}, ${p.metaDescription}, ${p.category},
        ${p.excerpt}, ${p.quickAnswer}, ${p.readTime}, ${p.date}, ${p.updatedAt || p.date}, ${p.image}, ${p.imageAlt},
        ${p.recommendedTourId || ""}, ${p.recommendedTourAfterBlock ?? null},
        ${JSON.stringify(p.content || "")}::jsonb, ${i},
        ${p.ctaHeading || ""}, ${p.ctaBody || ""}, ${p.ctaButtonText || ""}, ${p.ctaButtonHref || ""}, ${p.focusKeyword || ""},
        ${!!p.noIndex}, ${!!p.noFollow}, ${p.canonicalUrl || ""}, ${p.ogTitle || ""}, ${p.ogDescription || ""}, ${p.ogImage || ""}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        category = EXCLUDED.category,
        excerpt = EXCLUDED.excerpt,
        quick_answer = EXCLUDED.quick_answer,
        read_time = EXCLUDED.read_time,
        date = EXCLUDED.date,
        updated_at = EXCLUDED.updated_at,
        image = EXCLUDED.image,
        image_alt = EXCLUDED.image_alt,
        recommended_tour_id = EXCLUDED.recommended_tour_id,
        recommended_tour_after_block = EXCLUDED.recommended_tour_after_block,
        content = EXCLUDED.content,
        sort_order = EXCLUDED.sort_order,
        cta_heading = EXCLUDED.cta_heading,
        cta_body = EXCLUDED.cta_body,
        cta_button_text = EXCLUDED.cta_button_text,
        cta_button_href = EXCLUDED.cta_button_href,
        focus_keyword = EXCLUDED.focus_keyword,
        no_index = EXCLUDED.no_index,
        no_follow = EXCLUDED.no_follow,
        canonical_url = EXCLUDED.canonical_url,
        og_title = EXCLUDED.og_title,
        og_description = EXCLUDED.og_description,
        og_image = EXCLUDED.og_image
    `;
  }

  const existing = await sql`SELECT slug FROM posts`;
  const keepSlugs = posts.map((p) => p.slug);
  const toDelete = existing.map((r) => r.slug as string).filter((slug) => !keepSlugs.includes(slug));
  for (const slug of toDelete) {
    await sql`DELETE FROM posts WHERE slug = ${slug}`;
  }
}
