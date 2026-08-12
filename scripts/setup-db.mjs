// One-time (and safe-to-re-run) database setup for the admin CMS.
//
// What it does:
//   1. Creates every table the app needs, if they don't already exist.
//   2. If a table is empty, seeds it from the matching file in /data (the
//      real Seine River Cruise Tours starter content) so the site has
//      real tours/posts/FAQs/homepage copy from the first run.
//
// How to run it:
//   1. Add DATABASE_URL to your .env file — get it from your Neon project
//      dashboard → Connection Details → "Pooled connection" (or create a
//      free project at https://neon.tech first).
//   2. Also add the same DATABASE_URL to your Vercel project's
//      Settings → Environment Variables (for Production, Preview, and
//      Development) — the deployed app reads it the same way.
//   3. From the project root, run:
//        npm install
//        node scripts/setup-db.mjs
//   4. Redeploy (push to git, or `vercel --prod`).
//
// Safe to run again later — it only creates tables that don't exist yet,
// and only seeds a table if it's currently empty, so it will never
// overwrite content you've since edited through the live admin panel.

import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Add it to your .env file (see the comment at the top of this script), then re-run."
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const dataDir = path.join(process.cwd(), "data");

function readJsonFile(name) {
  const filePath = path.join(dataDir, name);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

async function createTables() {
  console.log("Creating tables (if they don't already exist)...");

  await sql`
    CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      badge TEXT NOT NULL,
      ribbon TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      includes JSONB NOT NULL DEFAULT '[]',
      duration TEXT,
      rating NUMERIC NOT NULL DEFAULT 5,
      reviews INTEGER NOT NULL DEFAULT 0,
      price INTEGER NOT NULL DEFAULT 0,
      original_price INTEGER,
      image TEXT NOT NULL,
      image_alt TEXT NOT NULL,
      href_path TEXT NOT NULL,
      href_extra TEXT,
      featured BOOLEAN NOT NULL DEFAULT false,
      best_for TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      meta_title TEXT NOT NULL,
      meta_description TEXT NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      quick_answer TEXT NOT NULL,
      read_time TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT NOT NULL,
      image_alt TEXT NOT NULL,
      recommended_tour_id TEXT NOT NULL DEFAULT '',
      recommended_tour_after_block INTEGER,
      content JSONB NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      no_index BOOLEAN NOT NULL DEFAULT false
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS homepage (
      id INTEGER PRIMARY KEY DEFAULT 1,
      hero_badge TEXT NOT NULL DEFAULT '',
      hero_heading TEXT NOT NULL DEFAULT '',
      hero_subheading TEXT NOT NULL DEFAULT '',
      hero_image TEXT NOT NULL DEFAULT '',
      hero_image_alt TEXT NOT NULL DEFAULT '',
      rating_value TEXT NOT NULL DEFAULT '',
      rating_count TEXT NOT NULL DEFAULT '',
      show_featured_tour BOOLEAN NOT NULL DEFAULT false,
      featured_tour_id TEXT NOT NULL DEFAULT '',
      featured_badge_label TEXT NOT NULL DEFAULT '',
      featured_urgency_text TEXT NOT NULL DEFAULT '',
      featured_reasons JSONB NOT NULL DEFAULT '[]',
      no_index BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT homepage_singleton CHECK (id = 1)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS privacy_policy (
      id INTEGER PRIMARY KEY DEFAULT 1,
      title TEXT NOT NULL DEFAULT 'Privacy Policy',
      last_updated TEXT NOT NULL DEFAULT '',
      content JSONB NOT NULL DEFAULT '[]',
      no_index BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT privacy_policy_singleton CHECK (id = 1)
    )
  `;

  // Per-page "Search Engine Indexing" toggle for the 3 public pages that
  // don't have their own dedicated table (About, Contact, Blog listing —
  // see lib/settings.ts). Defaults to false (indexable) for all three,
  // same default as every other page's own no_index column.
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      about_no_index BOOLEAN NOT NULL DEFAULT false,
      contact_no_index BOOLEAN NOT NULL DEFAULT false,
      blog_no_index BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT site_settings_singleton CHECK (id = 1)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      pages JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  console.log("Tables ready.");
}

async function seedTours() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM tours`;
  if (count > 0) {
    console.log(`tours: already has ${count} row(s) — skipping seed.`);
    return;
  }
  const tours = readJsonFile("tours.json");
  if (!tours || tours.length === 0) {
    console.log("tours: no data/tours.json to seed from — skipping.");
    return;
  }
  for (let i = 0; i < tours.length; i++) {
    const t = tours[i];
    await sql`
      INSERT INTO tours (
        id, badge, ribbon, title, description, includes, duration, rating,
        reviews, price, original_price, image, image_alt, href_path,
        href_extra, featured, best_for, sort_order
      ) VALUES (
        ${t.id}, ${t.badge}, ${t.ribbon || null}, ${t.title}, ${t.description},
        ${JSON.stringify(t.includes || [])}::jsonb, ${t.duration || null},
        ${t.rating ?? 5}, ${t.reviews ?? 0}, ${t.price ?? 0}, ${t.originalPrice ?? null},
        ${t.image}, ${t.imageAlt}, ${t.hrefPath}, ${t.hrefExtra || null},
        ${!!t.featured}, ${t.bestFor || ""}, ${i}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`tours: seeded ${tours.length} row(s).`);
}

async function seedPosts() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM posts`;
  if (count > 0) {
    console.log(`posts: already has ${count} row(s) — skipping seed.`);
    return;
  }
  const posts = readJsonFile("posts.json");
  if (!posts || posts.length === 0) {
    console.log("posts: no data/posts.json to seed from — skipping.");
    return;
  }
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await sql`
      INSERT INTO posts (
        slug, title, meta_title, meta_description, category, excerpt,
        quick_answer, read_time, date, image, image_alt,
        recommended_tour_id, recommended_tour_after_block, content, sort_order
      ) VALUES (
        ${p.slug}, ${p.title}, ${p.metaTitle}, ${p.metaDescription}, ${p.category},
        ${p.excerpt}, ${p.quickAnswer}, ${p.readTime}, ${p.date}, ${p.image}, ${p.imageAlt},
        ${p.recommendedTourId || ""}, ${p.recommendedTourAfterBlock ?? null},
        ${JSON.stringify(p.content || [])}::jsonb, ${i}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`posts: seeded ${posts.length} row(s).`);
}

async function seedHomepage() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM homepage`;
  if (count > 0) {
    console.log("homepage: already configured — skipping seed.");
    return;
  }
  const h = readJsonFile("homepage.json");
  if (!h) {
    console.log("homepage: no data/homepage.json to seed from — inserting defaults.");
    await sql`INSERT INTO homepage (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
    return;
  }
  await sql`
    INSERT INTO homepage (
      id, hero_badge, hero_heading, hero_subheading, hero_image, hero_image_alt,
      rating_value, rating_count, show_featured_tour, featured_tour_id,
      featured_badge_label, featured_urgency_text, featured_reasons
    ) VALUES (
      1, ${h.heroBadge || ""}, ${h.heroHeading || ""}, ${h.heroSubheading || ""},
      ${h.heroImage || ""}, ${h.heroImageAlt || ""}, ${h.ratingValue || ""}, ${h.ratingCount || ""},
      ${!!h.showFeaturedTour}, ${h.featuredTourId || ""}, ${h.featuredBadgeLabel || ""},
      ${h.featuredUrgencyText || ""}, ${JSON.stringify(h.featuredReasons || [])}::jsonb
    )
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("homepage: seeded from data/homepage.json.");
}

async function seedFaqs() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM faqs`;
  if (count > 0) {
    console.log(`faqs: already has ${count} row(s) — skipping seed.`);
    return;
  }
  const faqs = readJsonFile("faqs.json");
  if (!faqs || faqs.length === 0) {
    console.log("faqs: no data/faqs.json to seed from — skipping.");
    return;
  }
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    await sql`
      INSERT INTO faqs (question, answer, sort_order) VALUES (${f.question}, ${f.answer}, ${i})
    `;
  }
  console.log(`faqs: seeded ${faqs.length} row(s).`);
}

async function seedPrivacyPolicy() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM privacy_policy`;
  if (count > 0) {
    console.log("privacy_policy: already configured — skipping seed.");
    return;
  }
  const p = readJsonFile("privacy-policy.json");
  const today = new Date().toISOString().slice(0, 10);
  if (!p) {
    console.log("privacy_policy: no data/privacy-policy.json to seed from — inserting defaults.");
    await sql`INSERT INTO privacy_policy (id, last_updated) VALUES (1, ${today}) ON CONFLICT (id) DO NOTHING`;
    return;
  }
  await sql`
    INSERT INTO privacy_policy (id, title, last_updated, content)
    VALUES (1, ${p.title || "Privacy Policy"}, ${today}, ${JSON.stringify(p.content || [])}::jsonb)
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("privacy_policy: seeded from data/privacy-policy.json.");
}

async function seedSiteSettings() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM site_settings`;
  if (count > 0) {
    console.log("site_settings: already configured — skipping seed.");
    return;
  }
  await sql`INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
  console.log("site_settings: seeded (About/Contact/Blog indexing ON by default, same as every other page).");
}

// Users are NOT seeded from data/users.json on purpose — that file may
// contain stale/placeholder password hashes. Create real users from the
// live admin panel (Users page) instead; the .env ADMIN_EMAIL/ADMIN_PASSWORD
// owner account keeps working regardless.

async function main() {
  await createTables();
  await seedTours();
  await seedPosts();
  await seedHomepage();
  await seedFaqs();
  await seedPrivacyPolicy();
  await seedSiteSettings();
  console.log("\nDone. Your database is ready.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\nSetup failed:", err);
    process.exit(1);
  });
