import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";
import { getPrivacyPolicy } from "@/lib/legal";
import { getBlogSeoSettings } from "@/lib/settings";
import { getAboutPage } from "@/lib/about";
import { getContactPage } from "@/lib/contact";

// Auto-generated at request time (this route is dynamic by nature — it
// reads live blog posts from the database) and served at /sitemap.xml.
// Submit that URL in Google Search Console once the site is live.
//
// A URL only belongs in the sitemap if it is indexable and do-follow (noIndex: false, noFollow: false).
// Every page is index/follow by default; a page only drops out of the sitemap
// once its toggle is switched off in the admin dashboard.
// Rebuilt daily at most, and immediately after any admin save.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homepage, policy, posts, blogSeo, about, contact] = await Promise.all([
    getHomepageContent(),
    getPrivacyPolicy(),
    getPosts(),
    getBlogSeoSettings(),
    getAboutPage(),
    getContactPage(),
  ]);

  // Only the blog listing and posts have a real "last changed" time in the
  // database. The other pages omit lastmod rather than claiming "today" on
  // every rebuild, which teaches Google to ignore this site's lastmod.
  const postTime = (p: { updatedAt?: string; date?: string }) => {
    const t = new Date(p.updatedAt || p.date || "").getTime();
    return Number.isNaN(t) ? 0 : t;
  };
  const newestPost = posts.reduce((max, p) => Math.max(max, postTime(p)), 0);

  const staticRoutes: MetadataRoute.Sitemap = [
    ...(homepage.noIndex || homepage.noFollow
      ? []
      : [{ url: `${SITE_URL}/`, changeFrequency: "daily" as const, priority: 1.0 }]),
    ...(about.noIndex || about.noFollow
      ? []
      : [{ url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.8 }]),
    ...(contact.noIndex || contact.noFollow
      ? []
      : [{ url: `${SITE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.7 }]),
    ...(blogSeo.noIndex || blogSeo.noFollow
      ? []
      : [{ url: `${SITE_URL}/blog`, ...(newestPost ? { lastModified: new Date(newestPost) } : {}), changeFrequency: "weekly" as const, priority: 0.8 }]),
    ...(policy.noIndex || policy.noFollow
      ? []
      : [{ url: `${SITE_URL}/privacy-policy`, ...(policy.lastUpdated ? { lastModified: new Date(policy.lastUpdated) } : {}), changeFrequency: "yearly" as const, priority: 0.3 }]),
  ];

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noIndex && !post.noFollow)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(postTime(post) ? { lastModified: new Date(postTime(post)) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...postRoutes];
}
