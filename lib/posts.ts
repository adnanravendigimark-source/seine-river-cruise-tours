import { sql } from "./db";
import postsSeed from "@/data/posts.json";

// A post's body is a simple list of typed blocks rather than raw HTML/
// Markdown — easy for a non-technical content writer to edit in the admin
// UI (one field per block) and easy to render safely without a parser.
export type ContentBlockType = "paragraph" | "heading" | "list";

export interface ContentBlock {
  type: ContentBlockType;
  text?: string; // paragraph / heading
  items?: string[]; // list
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
  image: string;
  imageAlt: string;
  recommendedTourId: string;
  // 1-indexed: the "Recommended Tour" widget renders right after this many
  // content blocks. Leave unset/0 to not show it inline.
  recommendedTourAfterBlock?: number;
  content: ContentBlock[];
  // Search Engine Indexing toggle (admin-editable, per post). false (the
  // default) = indexable (index, follow). true = noindex, nofollow. See
  // lib/seo.ts for how this combines with the site-wide toggle.
  noIndex: boolean;
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
    image: row.image,
    imageAlt: row.image_alt,
    recommendedTourId: row.recommended_tour_id || "",
    recommendedTourAfterBlock:
      row.recommended_tour_after_block === null ? undefined : Number(row.recommended_tour_after_block),
    content: parseContent(row.content),
    noIndex: !!row.no_index,
  };
}

function seedPosts(): Post[] {
  return (postsSeed as any[]).map((p) => ({ ...p, noIndex: !!p.noIndex }));
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
    if (rows.length) return rows.map(rowToPost);
    // Empty/unreachable table — fall back to the real starter articles
    // baked into /data so the blog is never empty.
    return seedPosts();
  } catch {
    return seedPosts();
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  try {
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} LIMIT 1`;
    if (rows.length) return rowToPost(rows[0]);
    return seedPosts().find((p) => p.slug === slug);
  } catch {
    return seedPosts().find((p) => p.slug === slug);
  }
}

export async function getRelatedPosts(slug: string, count = 2): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.slug !== slug).slice(0, count);
}

// Replaces the full post list with exactly the given records — upserts
// everything passed in, then removes any row not present in `posts`. This
// matches how the admin API routes already call it (read the full list,
// apply one change, pass the whole thing back).
export async function savePosts(posts: Post[]): Promise<void> {
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await sql`
      INSERT INTO posts (
        slug, title, meta_title, meta_description, category, excerpt,
        quick_answer, read_time, date, image, image_alt,
        recommended_tour_id, recommended_tour_after_block, content, sort_order, no_index
      ) VALUES (
        ${p.slug}, ${p.title}, ${p.metaTitle}, ${p.metaDescription}, ${p.category},
        ${p.excerpt}, ${p.quickAnswer}, ${p.readTime}, ${p.date}, ${p.image}, ${p.imageAlt},
        ${p.recommendedTourId || ""}, ${p.recommendedTourAfterBlock ?? null},
        ${JSON.stringify(p.content || [])}::jsonb, ${i}, ${!!p.noIndex}
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
        image = EXCLUDED.image,
        image_alt = EXCLUDED.image_alt,
        recommended_tour_id = EXCLUDED.recommended_tour_id,
        recommended_tour_after_block = EXCLUDED.recommended_tour_after_block,
        content = EXCLUDED.content,
        sort_order = EXCLUDED.sort_order,
        no_index = EXCLUDED.no_index
    `;
  }

  const existing = await sql`SELECT slug FROM posts`;
  const keepSlugs = posts.map((p) => p.slug);
  const toDelete = existing.map((r) => r.slug as string).filter((slug) => !keepSlugs.includes(slug));
  for (const slug of toDelete) {
    await sql`DELETE FROM posts WHERE slug = ${slug}`;
  }
}
