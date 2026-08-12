import { sql } from "./db";

export interface HomepageContent {
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt: string;
  ratingValue: string;
  ratingCount: string;
  // "Featured/Recommended Tour" widget — a compact sticky bar on mobile,
  // a richer showcase card on desktop. Which tour it promotes and its
  // copy are both editable from /admin/homepage.
  showFeaturedTour: boolean;
  featuredTourId: string;
  featuredBadgeLabel: string;
  featuredUrgencyText: string;
  featuredReasons: string[];
  // Search Engine Indexing toggle (admin-editable). false (default) =
  // indexable (index, follow). true = noindex, nofollow. See lib/seo.ts.
  noIndex: boolean;
  // Independent "Link Following" toggle — see lib/seo.ts's resolveRobots.
  noFollow: boolean;
  // Blank = auto-generate from SITE_URL + "/" (see lib/seo.ts resolveCanonical).
  canonicalUrl: string;
  // Open Graph / Twitter overrides — blank falls back to the page's own
  // title/description/hero image (see lib/seo.ts resolveOg).
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Used whenever the `homepage` table is empty or unreachable (e.g.
// DATABASE_URL isn't set yet, or `node scripts/setup-db.mjs` hasn't been
// run) — the real Seine River Cruise Tours starter copy, not a generic
// placeholder, so the homepage never renders broken/blank.
const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroBadge: "⚓ Skip the line · Instant confirmation",
  heroHeading: "Seine River Cruise Tours — See Paris From the Water",
  heroSubheading:
    "Glide past the Eiffel Tower, Notre-Dame, and the Louvre on a sightseeing or dinner cruise along the Seine. Book online — instant confirmation, free cancellation on most tickets.",
  heroImage:
    "https://images.unsplash.com/photo-1774084930616-fce8eba59264?q=80&w=2400&auto=format&fit=crop",
  heroImageAlt: "The Eiffel Tower and the Seine River glowing at sunset in Paris",
  ratingValue: "4.6 / 5",
  ratingCount: "42,000+ reviews",
  showFeaturedTour: true,
  featuredTourId: "seine-sightseeing-cruise",
  featuredBadgeLabel: "Recommended",
  featuredUrgencyText: "Best Price · Limited Availability",
  featuredReasons: [
    "Our most-booked cruise — 42,000+ reviews, averaging 4.6 stars",
    "Departs every 30–45 minutes, all day",
    "Free cancellation up to 24 hours before",
  ],
  noIndex: false,
  noFollow: false,
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

function parseReasons(value: unknown): string[] {
  if (Array.isArray(value)) return value;
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

function rowToHomepage(row: any): HomepageContent {
  return {
    heroBadge: row.hero_badge || "",
    heroHeading: row.hero_heading || "",
    heroSubheading: row.hero_subheading || "",
    heroImage: row.hero_image || "",
    heroImageAlt: row.hero_image_alt || "",
    ratingValue: row.rating_value || "",
    ratingCount: row.rating_count || "",
    showFeaturedTour: !!row.show_featured_tour,
    featuredTourId: row.featured_tour_id || "",
    featuredBadgeLabel: row.featured_badge_label || "",
    featuredUrgencyText: row.featured_urgency_text || "",
    featuredReasons: parseReasons(row.featured_reasons),
    noIndex: !!row.no_index,
    noFollow: !!row.no_follow,
    canonicalUrl: row.canonical_url || "",
    ogTitle: row.og_title || "",
    ogDescription: row.og_description || "",
    ogImage: row.og_image || "",
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const rows = await sql`SELECT * FROM homepage WHERE id = 1 LIMIT 1`;
    return rows.length ? rowToHomepage(rows[0]) : DEFAULT_HOMEPAGE_CONTENT;
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

// Touches ONLY the indexing columns — used by the centralized "Indexing"
// admin tab (/admin/indexing) so flipping this page's Index/Follow toggle
// there can never clobber the rest of the Homepage form's fields no matter
// which was saved most recently.
export async function setHomepageIndexing(noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`
    INSERT INTO homepage (id, no_index, no_follow)
    VALUES (1, ${!!noIndex}, ${!!noFollow})
    ON CONFLICT (id) DO UPDATE SET
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow
  `;
}

export async function saveHomepageContent(data: HomepageContent): Promise<void> {
  await sql`
    INSERT INTO homepage (
      id, hero_badge, hero_heading, hero_subheading, hero_image, hero_image_alt,
      rating_value, rating_count, show_featured_tour, featured_tour_id,
      featured_badge_label, featured_urgency_text, featured_reasons, no_index,
      no_follow, canonical_url, og_title, og_description, og_image
    ) VALUES (
      1, ${data.heroBadge}, ${data.heroHeading}, ${data.heroSubheading}, ${data.heroImage},
      ${data.heroImageAlt}, ${data.ratingValue}, ${data.ratingCount}, ${!!data.showFeaturedTour},
      ${data.featuredTourId}, ${data.featuredBadgeLabel}, ${data.featuredUrgencyText},
      ${JSON.stringify(data.featuredReasons || [])}::jsonb, ${!!data.noIndex},
      ${!!data.noFollow}, ${data.canonicalUrl || ""}, ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_badge = EXCLUDED.hero_badge,
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      hero_image = EXCLUDED.hero_image,
      hero_image_alt = EXCLUDED.hero_image_alt,
      rating_value = EXCLUDED.rating_value,
      rating_count = EXCLUDED.rating_count,
      show_featured_tour = EXCLUDED.show_featured_tour,
      featured_tour_id = EXCLUDED.featured_tour_id,
      featured_badge_label = EXCLUDED.featured_badge_label,
      featured_urgency_text = EXCLUDED.featured_urgency_text,
      featured_reasons = EXCLUDED.featured_reasons,
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow,
      canonical_url = EXCLUDED.canonical_url,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image
  `;
}
