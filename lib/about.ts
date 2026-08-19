import { sql } from "./db";

// The About page used to be split into a dozen small fields (mission
// heading/paragraphs, a reasons array with icons, disclosure heading/body,
// CTA text, a second "intro" image, a contact prompt, ...). It's now one
// flowing rich-text `content` field — exactly like a blog post's content
// — edited with the same big article editor. This keeps the page far
// easier to write and re-order without touching JSX, and matches how the
// rest of the long-form content on this site (blog posts) already works.
// The hero banner (eyebrow/heading/subheading/image) stays separate since
// it's a distinct visual element, not part of the flowing body copy.
export interface AboutPageContent {
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// The full page body as one HTML blob — combines what used to be the
// separate mission intro, "how we choose" reasons, disclosure, and
// contact-prompt fields into a single article, in the same order they
// used to appear on the page.
const DEFAULT_CONTENT = `<h2>Our Mission</h2>
<p>We built this site around one belief: a Seine River cruise is one of the best, cheapest things you can do in Paris — but only if you book the right one. Some operators oversell tiny boats, some "dinner cruises" cut every corner on the food, and prices for the exact same route can vary by 30% depending on where you book.</p>
<p>We're an independent Seine River cruise guide — not an official operator's website. We compare sightseeing cruises, dinner cruises, and evening illuminations cruises from licensed, established Paris operators, and point you to the ones worth your time and money.</p>
<h2>How We Choose Our Seine River Cruises</h2>
<p>Every cruise listed on this site is screened against four criteria before it earns a spot.</p>
<ul>
<li><strong>Licensed, Established Operators</strong> — Every cruise we list runs with a licensed Paris operator, not a reseller adding a markup on top.</li>
<li><strong>Real Review Volume</strong> — We only list cruises with verifiable review counts and ratings, not cherry-picked testimonials.</li>
<li><strong>Transparent Pricing</strong> — The price you see on the tour card is the price you pay, no hidden fees added at checkout.</li>
<li><strong>Honest, Clear Info</strong> — We tell you exactly what's included, and what isn't, like dinner, which is only on the dinner cruise.</li>
</ul>
<h2>Independent Booking Guide</h2>
<p>This is an independent affiliate website, not an official Seine River cruise operator or a ticketing authority. We don't sell tickets ourselves — every booking on this site goes through GetYourGuide, a trusted third-party booking platform, subject to GetYourGuide's own terms, pricing, and cancellation policies.</p>
<h2>Our Content</h2>
<p>We write practical, honest guides, not oversold marketing copy. Cruise schedules, prices, and inclusions can change, so always check the current details on the booking page before you travel.</p>
<h2>Affiliate Disclosure</h2>
<p>When you book a Seine River cruise through a link on this site, we earn a small commission from the operator at no extra cost to you. This is how we keep the site free and independently written — it doesn't affect which cruises we recommend or how we rank them.</p>
<p>Have questions before you book? Reach out via our <a href="/contact">contact page</a>.</p>`;

const DEFAULT_ABOUT: AboutPageContent = {
  heroEyebrow: "About Us",
  heroHeading: "Your Independent Guide to Seine River Cruise Tickets",
  heroSubheading:
    "We help travelers book the right Seine River sightseeing or dinner cruise online — curated from licensed Paris operators, explained in plain language.",
  heroImage: "https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=2000&auto=format&fit=crop",
  heroImageAlt: "Eiffel Tower and the Seine River with sightseeing boats in Paris",
  content: DEFAULT_CONTENT,
  metaTitle: "About Us | Seine River Cruise Tour & Ticket Booking Guide",
  metaDescription:
    "Who curates our Seine River sightseeing and dinner cruises online, how we pick licensed operators, and why a good cruise beats a rushed one.",
  canonicalUrl: "",
  noIndex: false,
  noFollow: false,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

function rowToAbout(row: any): AboutPageContent {
  return {
    heroEyebrow: row.hero_eyebrow ?? DEFAULT_ABOUT.heroEyebrow,
    heroHeading: row.hero_heading ?? DEFAULT_ABOUT.heroHeading,
    heroSubheading: row.hero_subheading ?? DEFAULT_ABOUT.heroSubheading,
    heroImage: row.hero_image ?? DEFAULT_ABOUT.heroImage,
    heroImageAlt: row.hero_image_alt ?? DEFAULT_ABOUT.heroImageAlt,
    content: row.content || DEFAULT_ABOUT.content,
    metaTitle: row.meta_title || DEFAULT_ABOUT.metaTitle,
    metaDescription: row.meta_description || DEFAULT_ABOUT.metaDescription,
    canonicalUrl: row.canonical_url || "",
    noIndex: !!row.no_index,
    noFollow: !!row.no_follow,
    ogTitle: row.og_title || "",
    ogDescription: row.og_description || "",
    ogImage: row.og_image || "",
  };
}

export async function getAboutPage(): Promise<AboutPageContent> {
  try {
    const rows = await sql`SELECT * FROM about_page WHERE id = 1 LIMIT 1`;
    return rows.length ? rowToAbout(rows[0]) : DEFAULT_ABOUT;
  } catch {
    return DEFAULT_ABOUT;
  }
}

// Touches ONLY the indexing columns — used by the centralized "Indexing"
// admin tab (/admin/indexing).
export async function setAboutIndexing(noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`
    INSERT INTO about_page (id, no_index, no_follow)
    VALUES (1, ${!!noIndex}, ${!!noFollow})
    ON CONFLICT (id) DO UPDATE SET
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow
  `;
}

export async function saveAboutPage(data: AboutPageContent): Promise<void> {
  await sql`
    INSERT INTO about_page (
      id, hero_eyebrow, hero_heading, hero_subheading, hero_image, hero_image_alt,
      content, meta_title, meta_description, canonical_url, no_index, no_follow,
      og_title, og_description, og_image
    ) VALUES (
      1, ${data.heroEyebrow}, ${data.heroHeading}, ${data.heroSubheading}, ${data.heroImage}, ${data.heroImageAlt},
      ${data.content}, ${data.metaTitle}, ${data.metaDescription}, ${data.canonicalUrl || ""}, ${!!data.noIndex}, ${!!data.noFollow},
      ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_eyebrow = EXCLUDED.hero_eyebrow,
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      hero_image = EXCLUDED.hero_image,
      hero_image_alt = EXCLUDED.hero_image_alt,
      content = EXCLUDED.content,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      canonical_url = EXCLUDED.canonical_url,
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image
  `;
}
