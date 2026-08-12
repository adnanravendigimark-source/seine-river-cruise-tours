// The admin sections an "editor" account can be individually granted
// access to. Kept in its own dependency-free file (no `fs`, no Node APIs)
// so it can be safely imported from anywhere — the Edge middleware, the
// Node API routes, and client components alike.
export const PAGE_KEYS = ["homepage", "tours", "posts", "faqs", "privacy", "about", "contact", "pages"] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  homepage: "Homepage & Recommended Tour",
  tours: "Tours & Tickets",
  posts: "Blog Posts",
  faqs: "FAQs",
  privacy: "Privacy Policy",
  about: "About Page",
  contact: "Contact Page",
  pages: "Blog Page SEO",
};

export function isPageKey(value: unknown): value is PageKey {
  return typeof value === "string" && (PAGE_KEYS as readonly string[]).includes(value);
}
