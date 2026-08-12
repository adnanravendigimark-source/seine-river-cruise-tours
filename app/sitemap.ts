import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";
import { getPrivacyPolicy } from "@/lib/legal";
import { getPageIndexingSettings } from "@/lib/settings";

// Served at /sitemap.xml — Google reads this to discover every URL on the
// site. The static pages are listed directly; blog post slugs are fetched
// dynamically so newly published posts appear in the sitemap immediately
// without a rebuild.
//
// Every URL here is gated by that same page's "Search Engine Indexing"
// toggle (the one thing driving its <meta name="robots"> tag via
// lib/seo.ts's resolveRobots()) — a page with indexing turned OFF is
// dropped from this list entirely, not just marked noindex in its own
// <head>. Keeping a noindex URL in the sitemap is actively counterproductive
// (it's telling Google "please crawl this" and "please don't index this" at
// the same time), so this list must always match what's actually indexable.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, homepage, privacyPolicy, pageSettings] = await Promise.all([
    getPosts(),
    getHomepageContent(),
    getPrivacyPolicy(),
    getPageIndexingSettings(),
  ]);

  const staticPageCandidates: Array<MetadataRoute.Sitemap[number] & { noIndex: boolean }> = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
      noIndex: homepage.noIndex,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      noIndex: pageSettings.aboutNoIndex,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      noIndex: pageSettings.blogNoIndex,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      noIndex: pageSettings.contactNoIndex,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
      noIndex: privacyPolicy.noIndex,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPageCandidates
    .filter((page) => !page.noIndex)
    .map(({ noIndex, ...page }) => page);

  const postPages: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noIndex)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  return [...staticPages, ...postPages];
}
