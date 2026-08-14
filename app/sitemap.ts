import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";
import { getPrivacyPolicy } from "@/lib/legal";
import { getBlogSeoSettings } from "@/lib/settings";
import { getAboutPage } from "@/lib/about";
import { getContactPage } from "@/lib/contact";

export const dynamic = "force-dynamic";

// Auto-generated at request time (this route is dynamic by nature — it
// reads live blog posts from the database) and served at /sitemap.xml.
// Submit that URL in Google Search Console once the site is live.
//
// A URL only belongs in the sitemap if it is indexable and do-follow (noIndex: false, noFollow: false).
// Every page is index/follow by default; a page only drops out of the sitemap
// once its toggle is switched off in the admin dashboard.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homepage, policy, posts, blogSeo, about, contact] = await Promise.all([
    getHomepageContent(),
    getPrivacyPolicy(),
    getPosts(),
    getBlogSeoSettings(),
    getAboutPage(),
    getContactPage(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    ...(homepage.noIndex || homepage.noFollow
      ? []
      : [{ url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 }]),
    ...(about.noIndex || about.noFollow
      ? []
      : [{ url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }]),
    ...(contact.noIndex || contact.noFollow
      ? []
      : [{ url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }]),
    ...(blogSeo.noIndex || blogSeo.noFollow
      ? []
      : [{ url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 }]),
    ...(policy.noIndex || policy.noFollow
      ? []
      : [{ url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 }]),
  ];

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noIndex && !post.noFollow)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.date ? new Date(post.updatedAt || post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...postRoutes];
}
