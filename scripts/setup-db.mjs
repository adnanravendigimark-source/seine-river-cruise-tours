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
      price_table_column1 TEXT NOT NULL DEFAULT '',
      price_table_feature TEXT NOT NULL DEFAULT '',
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
      no_index BOOLEAN NOT NULL DEFAULT false,
      no_follow BOOLEAN NOT NULL DEFAULT false,
      canonical_url TEXT NOT NULL DEFAULT '',
      og_title TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      og_image TEXT NOT NULL DEFAULT ''
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
      no_follow BOOLEAN NOT NULL DEFAULT false,
      canonical_url TEXT NOT NULL DEFAULT '',
      og_title TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      og_image TEXT NOT NULL DEFAULT '',
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
      last_updated_label TEXT NOT NULL DEFAULT 'Last updated: ',
      empty_state_text TEXT NOT NULL DEFAULT E'This page hasn''t been filled in yet.',
      content JSONB NOT NULL DEFAULT '[]',
      no_index BOOLEAN NOT NULL DEFAULT false,
      no_follow BOOLEAN NOT NULL DEFAULT false,
      canonical_url TEXT NOT NULL DEFAULT '',
      meta_title TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      og_title TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      og_image TEXT NOT NULL DEFAULT '',
      CONSTRAINT privacy_policy_singleton CHECK (id = 1)
    )
  `;

  // Full SEO fields for the About page — every field admin-editable at
  // /admin/about (see lib/about.ts).
  await sql`
    CREATE TABLE IF NOT EXISTS about_page (
      id INTEGER PRIMARY KEY DEFAULT 1,
      hero_eyebrow TEXT NOT NULL DEFAULT '',
      hero_heading TEXT NOT NULL DEFAULT '',
      hero_subheading TEXT NOT NULL DEFAULT '',
      hero_image TEXT NOT NULL DEFAULT '',
      hero_image_alt TEXT NOT NULL DEFAULT '',
      intro_heading TEXT NOT NULL DEFAULT '',
      intro_paragraph_1 TEXT NOT NULL DEFAULT '',
      intro_paragraph_2 TEXT NOT NULL DEFAULT '',
      intro_image TEXT NOT NULL DEFAULT '',
      intro_image_alt TEXT NOT NULL DEFAULT '',
      reasons_heading TEXT NOT NULL DEFAULT '',
      reasons_subheading TEXT NOT NULL DEFAULT '',
      reasons JSONB NOT NULL DEFAULT '[]',
      disclosure_heading TEXT NOT NULL DEFAULT '',
      disclosure_body TEXT NOT NULL DEFAULT '',
      cta_text TEXT NOT NULL DEFAULT '',
      cta_button_label TEXT NOT NULL DEFAULT '',
      contact_prompt_html TEXT NOT NULL DEFAULT '',
      meta_title TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      canonical_url TEXT NOT NULL DEFAULT '',
      no_index BOOLEAN NOT NULL DEFAULT false,
      no_follow BOOLEAN NOT NULL DEFAULT false,
      og_title TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      og_image TEXT NOT NULL DEFAULT '',
      CONSTRAINT about_page_singleton CHECK (id = 1)
    )
  `;

  // Full SEO fields for the Contact page — every field admin-editable at
  // /admin/contact (see lib/contact.ts).
  await sql`
    CREATE TABLE IF NOT EXISTS contact_page (
      id INTEGER PRIMARY KEY DEFAULT 1,
      hero_eyebrow TEXT NOT NULL DEFAULT '',
      hero_heading TEXT NOT NULL DEFAULT '',
      hero_subheading TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      email_label TEXT NOT NULL DEFAULT 'Email us directly',
      email_note TEXT NOT NULL DEFAULT '',
      reasons_heading TEXT NOT NULL DEFAULT '',
      reasons JSONB NOT NULL DEFAULT '[]',
      footer_note TEXT NOT NULL DEFAULT '',
      cta_heading TEXT NOT NULL DEFAULT '',
      cta_button_label TEXT NOT NULL DEFAULT '',
      meta_title TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      canonical_url TEXT NOT NULL DEFAULT '',
      no_index BOOLEAN NOT NULL DEFAULT false,
      no_follow BOOLEAN NOT NULL DEFAULT false,
      og_title TEXT NOT NULL DEFAULT '',
      og_description TEXT NOT NULL DEFAULT '',
      og_image TEXT NOT NULL DEFAULT '',
      CONSTRAINT contact_page_singleton CHECK (id = 1)
    )
  `;

  // Full SEO fields for the Blog listing page — the one remaining public
  // page with no dedicated content table (see lib/settings.ts). About and
  // Contact used to share this table via *_no_index columns before they
  // got their own dedicated tables above.
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      blog_no_index BOOLEAN NOT NULL DEFAULT false,
      blog_no_follow BOOLEAN NOT NULL DEFAULT false,
      blog_meta_title TEXT NOT NULL DEFAULT '',
      blog_meta_description TEXT NOT NULL DEFAULT '',
      blog_canonical_url TEXT NOT NULL DEFAULT '',
      blog_og_title TEXT NOT NULL DEFAULT '',
      blog_og_description TEXT NOT NULL DEFAULT '',
      blog_og_image TEXT NOT NULL DEFAULT '',
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

// Full SEO field rollout (canonical URL, independent "Link Following"
// toggle, Open Graph overrides) on every table that already existed
// before these columns were added. Safe to re-run — ADD COLUMN IF NOT
// EXISTS is a no-op when the column is already there, so this never
// touches content you've already edited through the live admin panel.
async function addSeoColumns() {
  console.log("Ensuring SEO columns (canonical/follow/OG) exist on posts/homepage/privacy_policy...");

  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS no_follow BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image TEXT NOT NULL DEFAULT ''`;

  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS no_follow BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS canonical_url TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS og_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS og_image TEXT NOT NULL DEFAULT ''`;

  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS no_follow BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS canonical_url TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS og_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS og_image TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS meta_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT ''`;

  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_no_index BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_no_follow BOOLEAN NOT NULL DEFAULT false`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_meta_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_meta_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_canonical_url TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_og_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_og_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS blog_og_image TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE site_settings DROP COLUMN IF EXISTS search_indexing_enabled`;

  console.log("SEO columns ready.");

  // Per-tour value shown in the homepage price-comparison table's second
  // feature column (e.g. "Yes — lunch or crêpe tasting") — replaces what
  // used to be a hardcoded tour-ID check in components/PriceComparison.tsx.
  await sql`ALTER TABLE tours ADD COLUMN IF NOT EXISTS price_table_feature TEXT NOT NULL DEFAULT ''`;

  // Per-tour override for the price-comparison table's first feature
  // column (e.g. "1.5 hours") — blank falls back to the tour's own
  // Duration field.
  await sql`ALTER TABLE tours ADD COLUMN IF NOT EXISTS price_table_column1 TEXT NOT NULL DEFAULT ''`;

  // Small admin-editable strings added alongside the "make everything
  // editable" pass — About page's contact prompt, Contact page's email
  // label, and Privacy Policy's "last updated" label + empty-state text.
  await sql`ALTER TABLE about_page ADD COLUMN IF NOT EXISTS contact_prompt_html TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE about_page ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE contact_page ADD COLUMN IF NOT EXISTS email_label TEXT NOT NULL DEFAULT 'Email us directly'`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS last_updated_label TEXT NOT NULL DEFAULT 'Last updated: '`;
  await sql`ALTER TABLE privacy_policy ADD COLUMN IF NOT EXISTS empty_state_text TEXT NOT NULL DEFAULT E'This page hasn''t been filled in yet.'`;
}

// Full homepage CMS rollout — turns every visible piece of the homepage
// (navbar, footer, hero buttons/gallery, and every content section below
// the fold) into admin-editable data instead of hardcoded JSX. Each new
// column defaults to an empty/NULL-ish value; the app layer (lib/homepage.ts)
// falls back to the exact copy that used to be hardcoded whenever a column
// is empty, so running this never changes anything visible until an admin
// actually edits a field in the new /admin/homepage tabs.
async function addHomepageCmsColumns() {
  console.log("Ensuring full homepage-CMS columns exist on homepage...");
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS hero_gallery JSONB NOT NULL DEFAULT '[]'`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS hero_cta_primary_text TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS hero_cta_primary_href TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS hero_cta_secondary_text TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS hero_cta_secondary_href TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS meta_title TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS focus_keyword TEXT NOT NULL DEFAULT ''`;
  // sections_json holds the "What You See", "Illuminations Cruise",
  // "Practical Info", and "Price Comparison" sections — grouped into one
  // JSONB column (rather than ~30 separate columns) since they're always
  // saved together from the same admin tab and read together on every
  // homepage render.
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS sections_json JSONB NOT NULL DEFAULT '{}'`;
  // header_json/footer_json/theme_json are technically site-wide (every
  // page renders the navbar, footer, and brand colors, not just the
  // homepage) but are edited from the Homepage admin tab for simplicity —
  // they live here rather than a new table since there's only one site.
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS header_json JSONB NOT NULL DEFAULT '{}'`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS footer_json JSONB NOT NULL DEFAULT '{}'`;
  await sql`ALTER TABLE homepage ADD COLUMN IF NOT EXISTS theme_json JSONB NOT NULL DEFAULT '{}'`;
  console.log("Homepage-CMS columns ready.");
}

// Full CMS upgrade for the Blog Posts admin editor: a "last updated" date
// (for Article schema's dateModified + the sitemap's lastModified), a
// focus-keyword writing aid matching the homepage's, and the editable
// "Ready to book?" closing CTA (each defaults to '' — the app layer in
// lib/posts.ts's rowToPost/seedPosts falls back to the original hardcoded
// CTA copy whenever these are empty, so running this never changes
// anything visible until an admin actually edits it). Also adds the table
// that backs "renaming a post's URL automatically redirects the old
// address".
async function addBlogCmsColumns() {
  console.log("Ensuring full blog-CMS columns exist on posts...");
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta_heading TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta_body TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta_button_text TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta_button_href TEXT NOT NULL DEFAULT ''`;
  await sql`
    CREATE TABLE IF NOT EXISTS post_redirects (
      old_slug TEXT PRIMARY KEY,
      new_slug TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log("Blog-CMS columns ready.");
}

// Every image ever uploaded through the admin (hero images, tour photos,
// inline article images, etc.) gets one row here — permanently. Nothing in
// this codebase ever deletes a Blob or a row from this table: replacing a
// field's image just points that field at a new URL, the old upload stays
// live in Blob storage and listed here so it can be reused later. This is
// what powers the "Media Library" tab in every image picker.
async function addMediaLibraryTable() {
  console.log("Ensuring media_library table exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS media_library (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL DEFAULT '',
      content_type TEXT NOT NULL DEFAULT '',
      size_bytes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log("media_library table ready.");
}

// Carries forward the old per-page About/Contact noindex flags (which used
// to live on site_settings) into the new dedicated about_page/contact_page
// tables, then drops the old columns. Deliberately runs via UPDATE, AFTER
// seedAboutPage()/seedContactPage() have already inserted the full page
// content (see main() below) — inserting a bare {id, no_index} row here
// first would make the seed functions' own COUNT(*) > 0 check think the
// page was "already configured" and skip seeding the real copy, leaving
// every other field blank.
async function migrateAboutContactNoIndex() {
  const hasOldAboutCol = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'about_no_index'
  `;
  if (!hasOldAboutCol.length) return;

  console.log("Carrying forward old About/Contact noindex flags into about_page/contact_page...");
  const [old] = await sql`SELECT about_no_index, contact_no_index FROM site_settings WHERE id = 1 LIMIT 1`;
  if (old) {
    await sql`UPDATE about_page SET no_index = ${!!old.about_no_index} WHERE id = 1`;
    await sql`UPDATE contact_page SET no_index = ${!!old.contact_no_index} WHERE id = 1`;
  }
  await sql`ALTER TABLE site_settings DROP COLUMN IF EXISTS about_no_index`;
  await sql`ALTER TABLE site_settings DROP COLUMN IF EXISTS contact_no_index`;
  console.log("About/Contact noindex flags migrated.");
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
  const blogTitle = "Seine River Cruise Guides & Tips | Seine River Cruise Tours";
  const blogDescription =
    "Practical guides for a Seine River cruise in Paris — sightseeing vs. dinner cruise, best time to go, and more.";
  await sql`
    INSERT INTO site_settings (id, blog_meta_title, blog_meta_description)
    VALUES (1, ${blogTitle}, ${blogDescription})
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("site_settings: seeded (Blog listing page SEO fields, indexing ON by default).");
}

// About/Contact used to be a single indexing toggle each on site_settings
// — they're now full CMS-editable pages (lib/about.ts, lib/contact.ts).
// This seeds the exact copy that used to be hardcoded directly in
// app/about/page.tsx / app/contact/page.tsx, so nothing changes visually
// on first migration — every field just becomes admin-editable.
async function seedAboutPage() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM about_page`;
  if (count > 0) {
    console.log("about_page: already configured — skipping seed.");
    return;
  }
  const reasons = [
    { icon: "ShieldCheckIcon", title: "Licensed, Established Operators", body: "Every cruise we list runs with a licensed Paris operator — not a reseller adding a markup on top." },
    { icon: "StarIcon", title: "Real Review Volume", body: "We only list cruises with verifiable review counts and ratings, not cherry-picked testimonials." },
    { icon: "LockIcon", title: "Transparent Pricing", body: "The price you see on the tour card is the price you pay — no hidden fees added at checkout." },
    { icon: "HeadsetIcon", title: "Honest, Clear Info", body: "We tell you exactly what's included — and what isn't, like dinner, which is only on the dinner cruise." },
  ];
  const a = {
    heroEyebrow: "About Us",
    heroHeading: "Your Independent Guide to Seine River Cruise Tickets",
    heroSubheading:
      "We help travelers book the right Seine River sightseeing or dinner cruise online — curated from licensed Paris operators, explained in plain language.",
    heroImage: "https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=2000&auto=format&fit=crop",
    heroImageAlt: "Eiffel Tower and the Seine River with sightseeing boats in Paris",
    introHeading: "Why We Built a Seine River Cruise Guide",
    introParagraph1:
      "We built this site around one belief: a Seine River cruise is one of the best, cheapest things you can do in Paris — but only if you book the right one. Some operators oversell tiny boats, some \"dinner cruises\" cut every corner on the food, and prices for the exact same route can vary by 30% depending on where you book.",
    introParagraph2:
      "We're an independent Seine river cruise guide — not an official operator's website. We compare sightseeing cruises, dinner cruises, and evening illuminations cruises from licensed, established Paris operators, currently via GetYourGuide, and point you to the ones worth your time and money.",
    introImage: "https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=1000&auto=format&fit=crop",
    introImageAlt: "A river cruise boat gliding past illuminated buildings on the Seine at night",
    reasonsHeading: "How We Pick Our Seine River Cruises",
    reasonsSubheading: "Every cruise listed on this site is screened against four criteria before it earns a spot.",
    disclosureHeading: "A Note on How We Earn",
    disclosureBody:
      "When you book a Seine River cruise through a link on this site, we earn a small commission from the operator at no extra cost to you. This is how we keep the site free and independently written — it doesn't affect which cruises we recommend or how we rank them.",
    ctaText: "Ready to book your Seine River cruise?",
    ctaButtonLabel: "Compare Seine River Cruises",
    metaTitle: "About Us | Seine River Cruise Tour & Ticket Booking Guide",
    metaDescription:
      "Who curates our Seine River sightseeing and dinner cruises online, how we pick licensed operators, and why a good cruise beats a rushed one.",
  };
  await sql`
    INSERT INTO about_page (
      id, hero_eyebrow, hero_heading, hero_subheading, hero_image, hero_image_alt,
      intro_heading, intro_paragraph_1, intro_paragraph_2, intro_image, intro_image_alt,
      reasons_heading, reasons_subheading, reasons,
      disclosure_heading, disclosure_body, cta_text, cta_button_label,
      meta_title, meta_description
    ) VALUES (
      1, ${a.heroEyebrow}, ${a.heroHeading}, ${a.heroSubheading}, ${a.heroImage}, ${a.heroImageAlt},
      ${a.introHeading}, ${a.introParagraph1}, ${a.introParagraph2}, ${a.introImage}, ${a.introImageAlt},
      ${a.reasonsHeading}, ${a.reasonsSubheading}, ${JSON.stringify(reasons)}::jsonb,
      ${a.disclosureHeading}, ${a.disclosureBody}, ${a.ctaText}, ${a.ctaButtonLabel},
      ${a.metaTitle}, ${a.metaDescription}
    )
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("about_page: seeded with the existing About page copy.");
}

async function seedContactPage() {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM contact_page`;
  if (count > 0) {
    console.log("contact_page: already configured — skipping seed.");
    return;
  }
  const reasons = [
    { icon: "HeadsetIcon", title: "Booking Help", body: "Not sure whether to book the sightseeing cruise, dinner cruise, or evening illuminations cruise? Ask before you book." },
    { icon: "BriefcaseIcon", title: "Partnerships & Affiliates", body: "Cruise operators, DMCs, and affiliate partners — reach out about listing or collaboration opportunities." },
    { icon: "MailIcon", title: "General Questions", body: "Site feedback, content corrections, or anything else about Seine River cruises." },
  ];
  const c = {
    heroEyebrow: "Contact",
    heroHeading: "Get in Touch",
    heroSubheading:
      "Questions about a Seine River cruise or ticket — or a partnership inquiry? Reach out directly by email.",
    email: "livetravelpartner@gmail.com",
    emailNote: "We typically reply within 1–2 business days.",
    reasonsHeading: "What we can help with",
    footerNote:
      "Already have a booking? Contact the cruise operator directly via your confirmation email — they handle changes and refunds faster than we can.",
    ctaHeading: "Not booked yet?",
    ctaButtonLabel: "Compare Seine River Cruises & Tickets",
    metaTitle: "Contact Us | Seine River Cruise Tours",
    metaDescription:
      "Questions about booking a Seine River sightseeing cruise, dinner cruise, or tickets online? Reach out directly — including for partnership and affiliate inquiries.",
  };
  await sql`
    INSERT INTO contact_page (
      id, hero_eyebrow, hero_heading, hero_subheading, email, email_note,
      reasons_heading, reasons, footer_note, cta_heading, cta_button_label,
      meta_title, meta_description
    ) VALUES (
      1, ${c.heroEyebrow}, ${c.heroHeading}, ${c.heroSubheading}, ${c.email}, ${c.emailNote},
      ${c.reasonsHeading}, ${JSON.stringify(reasons)}::jsonb, ${c.footerNote}, ${c.ctaHeading}, ${c.ctaButtonLabel},
      ${c.metaTitle}, ${c.metaDescription}
    )
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("contact_page: seeded with the existing Contact page copy.");
}

// Users are NOT seeded from data/users.json on purpose — that file may
// contain stale/placeholder password hashes. Create real users from the
// live admin panel (Users page) instead; the .env ADMIN_EMAIL/ADMIN_PASSWORD
// owner account keeps working regardless.

async function main() {
  await createTables();
  await addSeoColumns();
  await addHomepageCmsColumns();
  await addBlogCmsColumns();
  await addMediaLibraryTable();
  await seedTours();
  await seedPosts();
  await seedHomepage();
  await seedFaqs();
  await seedPrivacyPolicy();
  await seedSiteSettings();
  await seedAboutPage();
  await seedContactPage();
  await migrateAboutContactNoIndex();
  console.log("\nDone. Your database is ready.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\nSetup failed:", err);
    process.exit(1);
  });
