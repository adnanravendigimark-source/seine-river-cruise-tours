import { SITE_URL } from "./site";

// Rich-text fields (hero subheading, section intros, etc.) are stored as
// HTML from RichTextEditor.tsx — safe to render on the page itself via
// dangerouslySetInnerHTML, but raw tags must never leak into a <meta>
// tag, OG description, JSON-LD string, or anywhere else that expects
// plain text. Use this to get a plain-text version of any rich-text
// field before it's used in one of those contexts.
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// The single place that turns a page's "Search Engine Indexing" +
// "Link Following" toggles into the `robots` metadata value Next.js
// renders as <meta name="robots">.
//
// Every public page that has its own per-page toggle must call this and
// set the result as that page's own `robots` key in its metadata —
// Next.js's Metadata API does NOT deep-merge `robots` from a parent
// layout into a child page's metadata, so relying on inheritance would
// silently produce the wrong tag. Pages with no toggle of their own
// simply don't set `robots` and inherit the root layout's index/follow
// default.
//
// Index and Follow are independent controls (Index ON + Follow OFF is a
// valid, meaningful combination — e.g. "don't show this page in results,
// but still count the links on it"). `noFollow` defaults to `noIndex`'s
// value when not explicitly provided, so older rows that only ever
// stored a single "no_index" column keep behaving exactly as before.
export function resolveRobots(
  noIndex: boolean,
  noFollow: boolean = noIndex
): { index: boolean; follow: boolean } {
  return { index: !noIndex, follow: !noFollow };
}

// Every page's canonical URL, resolved the same way everywhere: an
// admin-entered override wins if present (must be a full https:// URL,
// pasted as-is — same "trust what the admin typed" rule as the
// GetYourGuide link field); otherwise it's safely derived from the
// site's own URL + the page's own path, so a canonical always exists
// even if the admin field is left blank.
export function resolveCanonical(path: string, override?: string | null): string {
  const trimmed = (override || "").trim();
  if (trimmed) return trimmed;
  const cleanPath = path === "/" ? "" : path;
  return `${SITE_URL}${cleanPath}`;
}

// Shared shape for the "Open Graph" / "Twitter/X" admin fields every
// content type now carries (homepage, posts, privacy policy, about,
// contact, blog listing). Twitter/X's own crawler already reads Open
// Graph tags as a fallback when no twitter:* tags are present, so this
// deliberately does NOT add a second full set of twitter-only fields for
// the admin to fill in — that would just be duplicate data entry with no
// real SEO benefit. Instead every page's `twitter` metadata is derived
// from the same resolved OG title/description/image below.
export interface OgFields {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function resolveOg(
  fields: OgFields,
  fallback: { title: string; description: string; image?: string }
) {
  return {
    title: fields.ogTitle?.trim() || fallback.title,
    description: fields.ogDescription?.trim() || fallback.description,
    image: fields.ogImage?.trim() || fallback.image || "",
  };
}

// One breadcrumb entry: `name` is what's shown, `path` is site-relative
// (e.g. "/blog/best-time-to-visit"). The final entry (the current page)
// should still be included — resolveCanonical/SITE_URL below turns every
// entry into the absolute URL schema.org's BreadcrumbList requires.
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

// Article structured data for a blog post — eligible for article rich
// results and helps Google understand publish date/author/section.
// `authorName` defaults to the site's own brand name since these are
// single-author-style guides, not a multi-writer publication.
export function buildArticleJsonLd(article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  // Defaults to datePublished when the post has never been re-saved since
  // the updatedAt column was added — see lib/posts.ts's rowToPost.
  dateModified?: string;
  url: string;
  authorName: string;
  siteName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    ...(article.image ? { image: [article.image] } : {}),
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: article.siteName },
    mainEntityOfPage: { "@type": "WebPage", "@id": article.url },
  };
}
