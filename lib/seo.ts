// The single place that turns a page's "Search Engine Indexing" toggle
// (posts.no_index, homepage.no_index, privacy_policy.no_index,
// site_settings.about_no_index/contact_no_index/blog_no_index — see
// lib/posts.ts, lib/homepage.ts, lib/legal.ts, lib/settings.ts) into the
// `robots` metadata value Next.js renders as <meta name="robots">.
//
// Every public page that has its own per-page toggle must call this and
// set the result as that page's own `robots` key in its metadata —
// Next.js's Metadata API does NOT deep-merge `robots` from a parent
// layout into a child page's metadata, so relying on inheritance would
// silently produce the wrong tag. Pages with no toggle of their own
// simply don't set `robots` and inherit the root layout's index/follow
// default.
export function resolveRobots(pageNoIndex: boolean): { index: boolean; follow: boolean } {
  return pageNoIndex ? { index: false, follow: false } : { index: true, follow: true };
}
