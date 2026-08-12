import { getHomepageContent, setHomepageIndexing } from "./homepage";
import { getBlogSeoSettings, setBlogIndexing } from "./settings";
import { getPrivacyPolicy, setPrivacyIndexing } from "./legal";
import { getAboutPage, setAboutIndexing } from "./about";
import { getContactPage, setContactIndexing } from "./contact";
import { getPosts, setPostIndexing } from "./posts";

// Every distinct "page" on the public site that has its own Index/Follow
// state, flattened into one list for the centralized Indexing admin tab
// (/admin/indexing) — the single place these toggles are changed now,
// instead of being scattered across each content editor. `type` + `slug`
// together are what a PUT to /api/admin/indexing needs to know which
// underlying table/row to update.
export type IndexingPageType = "homepage" | "blog" | "privacy" | "about" | "contact" | "post";

export interface IndexingRow {
  type: IndexingPageType;
  key: string; // stable unique id for React keys / lookups, e.g. "post:my-slug"
  label: string;
  url: string;
  slug?: string; // only set for type "post"
  noIndex: boolean;
  noFollow: boolean;
}

export async function getIndexingOverview(): Promise<IndexingRow[]> {
  const [homepage, blogSeo, privacy, about, contact, posts] = await Promise.all([
    getHomepageContent(),
    getBlogSeoSettings(),
    getPrivacyPolicy(),
    getAboutPage(),
    getContactPage(),
    getPosts(),
  ]);

  const rows: IndexingRow[] = [
    { type: "homepage", key: "homepage", label: "Homepage", url: "/", noIndex: homepage.noIndex, noFollow: homepage.noFollow },
    { type: "about", key: "about", label: "About", url: "/about", noIndex: about.noIndex, noFollow: about.noFollow },
    { type: "contact", key: "contact", label: "Contact", url: "/contact", noIndex: contact.noIndex, noFollow: contact.noFollow },
    { type: "blog", key: "blog", label: "Blog (listing page)", url: "/blog", noIndex: blogSeo.noIndex, noFollow: blogSeo.noFollow },
    { type: "privacy", key: "privacy", label: "Privacy Policy", url: "/privacy-policy", noIndex: privacy.noIndex, noFollow: privacy.noFollow },
    ...posts.map((p) => ({
      type: "post" as const,
      key: `post:${p.slug}`,
      label: p.title,
      url: `/blog/${p.slug}`,
      slug: p.slug,
      noIndex: p.noIndex,
      noFollow: p.noFollow,
    })),
  ];

  return rows;
}

export async function setIndexing(
  type: IndexingPageType,
  noIndex: boolean,
  noFollow: boolean,
  slug?: string
): Promise<void> {
  switch (type) {
    case "homepage":
      return setHomepageIndexing(noIndex, noFollow);
    case "blog":
      return setBlogIndexing(noIndex, noFollow);
    case "privacy":
      return setPrivacyIndexing(noIndex, noFollow);
    case "about":
      return setAboutIndexing(noIndex, noFollow);
    case "contact":
      return setContactIndexing(noIndex, noFollow);
    case "post":
      if (!slug) throw new Error("A post slug is required to change a post's indexing.");
      return setPostIndexing(slug, noIndex, noFollow);
  }
}
