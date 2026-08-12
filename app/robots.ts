import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Served at /robots.txt.
//
// Deliberately does NOT disallow /admin or /api here. Those are kept out
// of search results via an X-Robots-Tag: noindex header (see middleware.ts)
// instead — Google's own guidance is not to combine the two: if robots.txt
// blocks crawling, Googlebot can never fetch the page to see the noindex
// signal, and the URL can still end up indexed with no snippet. Since
// /admin is also behind a login wall, there's nothing there to crawl
// anyway — the noindex header is what actually keeps it out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
