import { sql } from "./db";

// One "why us" trust card. `icon` is a key into the fixed ICON_OPTIONS map
// (see components/admin/IconPicker.tsx) rather than a component reference
// — the DB stores plain JSON, it can't store a React component.
export interface AboutReason {
  icon: string;
  title: string;
  body: string;
}

export interface AboutPageContent {
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt: string;
  introHeading: string;
  introParagraph1: string;
  introParagraph2: string;
  introImage: string;
  introImageAlt: string;
  reasonsHeading: string;
  reasonsSubheading: string;
  reasons: AboutReason[];
  disclosureHeading: string;
  disclosureBody: string;
  ctaText: string;
  ctaButtonLabel: string;
  // Small line under the CTA box pointing to the Contact page — rich text
  // so the "contact page" link inside it stays editable too. See
  // app/about/page.tsx.
  contactPromptHtml: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const DEFAULT_ABOUT: AboutPageContent = {
  heroEyebrow: "About Us",
  heroHeading: "Your Independent Guide to Seine River Cruise Tickets",
  heroSubheading:
    "We help travelers book the right Seine River sightseeing or dinner cruise online — curated from licensed Paris operators, explained in plain language.",
  heroImage: "https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=2000&auto=format&fit=crop",
  heroImageAlt: "Eiffel Tower and the Seine River with sightseeing boats in Paris",
  introHeading: "Why We Built a Seine River Cruise Guide",
  introParagraph1:
    "We built this site around one belief: a Seine River cruise is one of the best, cheapest things you can do in Paris — but only if you book the right one. Some operators oversell tiny boats, some \"dinner cruises\" cut every corner on the food, and prices for the exact same route can vary by 30% depending on where you book.",
  introParagraph2:
    "We're an independent Seine river cruise guide — not an official operator's website. We compare sightseeing cruises, dinner cruises, and evening illuminations cruises from licensed, established Paris operators, currently via GetYourGuide, and point you to the ones worth your time and money.",
  introImage: "https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=1000&auto=format&fit=crop",
  introImageAlt: "A river cruise boat gliding past illuminated buildings on the Seine at night",
  reasonsHeading: "How We Pick Our Seine River Cruises",
  reasonsSubheading: "Every cruise listed on this site is screened against four criteria before it earns a spot.",
  reasons: [
    { icon: "ShieldCheckIcon", title: "Licensed, Established Operators", body: "Every cruise we list runs with a licensed Paris operator — not a reseller adding a markup on top." },
    { icon: "StarIcon", title: "Real Review Volume", body: "We only list cruises with verifiable review counts and ratings, not cherry-picked testimonials." },
    { icon: "LockIcon", title: "Transparent Pricing", body: "The price you see on the tour card is the price you pay — no hidden fees added at checkout." },
    { icon: "HeadsetIcon", title: "Honest, Clear Info", body: "We tell you exactly what's included — and what isn't, like dinner, which is only on the dinner cruise." },
  ],
  disclosureHeading: "A Note on How We Earn",
  disclosureBody:
    "When you book a Seine River cruise through a link on this site, we earn a small commission from the operator at no extra cost to you. This is how we keep the site free and independently written — it doesn't affect which cruises we recommend or how we rank them.",
  ctaText: "Ready to book your Seine River cruise?",
  ctaButtonLabel: "Compare Seine River Cruises",
  contactPromptHtml:
    "Questions before you book? Reach out via our <a href=\"/contact\">contact page</a>.",
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

function parseReasons(value: unknown): AboutReason[] {
  if (Array.isArray(value)) return value as AboutReason[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToAbout(row: any): AboutPageContent {
  return {
    heroEyebrow: row.hero_eyebrow ?? DEFAULT_ABOUT.heroEyebrow,
    heroHeading: row.hero_heading ?? DEFAULT_ABOUT.heroHeading,
    heroSubheading: row.hero_subheading ?? DEFAULT_ABOUT.heroSubheading,
    heroImage: row.hero_image ?? DEFAULT_ABOUT.heroImage,
    heroImageAlt: row.hero_image_alt ?? DEFAULT_ABOUT.heroImageAlt,
    introHeading: row.intro_heading ?? DEFAULT_ABOUT.introHeading,
    introParagraph1: row.intro_paragraph_1 ?? DEFAULT_ABOUT.introParagraph1,
    introParagraph2: row.intro_paragraph_2 ?? DEFAULT_ABOUT.introParagraph2,
    introImage: row.intro_image ?? DEFAULT_ABOUT.introImage,
    introImageAlt: row.intro_image_alt ?? DEFAULT_ABOUT.introImageAlt,
    reasonsHeading: row.reasons_heading ?? DEFAULT_ABOUT.reasonsHeading,
    reasonsSubheading: row.reasons_subheading ?? DEFAULT_ABOUT.reasonsSubheading,
    reasons: parseReasons(row.reasons).length ? parseReasons(row.reasons) : DEFAULT_ABOUT.reasons,
    disclosureHeading: row.disclosure_heading ?? DEFAULT_ABOUT.disclosureHeading,
    disclosureBody: row.disclosure_body ?? DEFAULT_ABOUT.disclosureBody,
    ctaText: row.cta_text ?? DEFAULT_ABOUT.ctaText,
    ctaButtonLabel: row.cta_button_label ?? DEFAULT_ABOUT.ctaButtonLabel,
    contactPromptHtml: row.contact_prompt_html ?? DEFAULT_ABOUT.contactPromptHtml,
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
      intro_heading, intro_paragraph_1, intro_paragraph_2, intro_image, intro_image_alt,
      reasons_heading, reasons_subheading, reasons,
      disclosure_heading, disclosure_body, cta_text, cta_button_label, contact_prompt_html,
      meta_title, meta_description, canonical_url, no_index, no_follow,
      og_title, og_description, og_image
    ) VALUES (
      1, ${data.heroEyebrow}, ${data.heroHeading}, ${data.heroSubheading}, ${data.heroImage}, ${data.heroImageAlt},
      ${data.introHeading}, ${data.introParagraph1}, ${data.introParagraph2}, ${data.introImage}, ${data.introImageAlt},
      ${data.reasonsHeading}, ${data.reasonsSubheading}, ${JSON.stringify(data.reasons || [])}::jsonb,
      ${data.disclosureHeading}, ${data.disclosureBody}, ${data.ctaText}, ${data.ctaButtonLabel}, ${data.contactPromptHtml},
      ${data.metaTitle}, ${data.metaDescription}, ${data.canonicalUrl || ""}, ${!!data.noIndex}, ${!!data.noFollow},
      ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_eyebrow = EXCLUDED.hero_eyebrow,
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      hero_image = EXCLUDED.hero_image,
      hero_image_alt = EXCLUDED.hero_image_alt,
      intro_heading = EXCLUDED.intro_heading,
      intro_paragraph_1 = EXCLUDED.intro_paragraph_1,
      intro_paragraph_2 = EXCLUDED.intro_paragraph_2,
      intro_image = EXCLUDED.intro_image,
      intro_image_alt = EXCLUDED.intro_image_alt,
      reasons_heading = EXCLUDED.reasons_heading,
      reasons_subheading = EXCLUDED.reasons_subheading,
      reasons = EXCLUDED.reasons,
      disclosure_heading = EXCLUDED.disclosure_heading,
      disclosure_body = EXCLUDED.disclosure_body,
      cta_text = EXCLUDED.cta_text,
      cta_button_label = EXCLUDED.cta_button_label,
      contact_prompt_html = EXCLUDED.contact_prompt_html,
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
