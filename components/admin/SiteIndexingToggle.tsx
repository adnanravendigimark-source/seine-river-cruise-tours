// The site-wide "Visible to Google" master switch was removed per request
// — indexing is now controlled entirely by each page's own "Search Engine
// Indexing" toggle (see components/admin/IndexingToggle.tsx and
// lib/seo.ts). This file can't be deleted from here, so its content has
// been emptied out rather than left as unused dead code.
export default function SiteIndexingToggle() {
  return null;
}
