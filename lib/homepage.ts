import { sql } from "./db";

export interface GalleryImage {
  src: string;
  alt: string;
  label: string;
}

export interface TimelineRow {
  time: string;
  step: string;
}

export interface HoursRow {
  range: string;
  time: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Tour grid intro (the heading + subheading directly above the tour cards,
// right below the hero — see components/TourGrid.tsx).
export interface TourSection {
  heading: string;
  subheading: string;
}

// "What You See" section (the route timeline + what-you'll-notice section
// right below the tour grid).
export interface WhySection {
  heading: string;
  intro: string; // rich text HTML
  timelineHeading: string;
  timeline: TimelineRow[];
  learnHeading: string;
  learn: string[];
  note: string;
  // Optional third block — used here for "Where you can board".
  extraHeading: string;
  extraItems: { name: string; note: string }[];
  ctaText: string;
  ctaButtonText: string;
  ctaHref: string;
}

// "Seine River Highlights" trust/highlights section, right below the
// "What You See" section — see components/RiverHighlights.tsx.
export interface HighlightCard {
  icon: string; // emoji, rendered as-is
  title: string;
  body: string;
}
export interface HighlightsSection {
  eyebrow: string;
  heading: string;
  subheading: string;
  cards: HighlightCard[];
}

// "Illuminations Cruise" (evening cruise with music) section.
export interface TowerSection {
  eyebrow: string;
  heading: string;
  body: string; // rich text HTML
  bullets: string[];
  ctaButtonText: string;
  ctaHref: string;
  images: GalleryImage[];
}

// "Practical Info" section (cruise schedule / boarding points / best time).
export interface PracticalSection {
  hoursHeading: string;
  hours: HoursRow[];
  hoursNote: string;
  addressHeading: string;
  address: string;
  metro: string;
  bestTimeHeading: string;
  bestTimeBody: string; // rich text HTML
}

// "Compare & Choose" price table intro.
export interface PriceSection {
  heading: string;
  subheading: string;
  note: string;
  // Column headers for the price-comparison table below — admin-editable
  // so a differently-shaped product (e.g. a river cruise site with
  // "Duration"/"Meal Included" instead of "Live Guide"/"Tower Access")
  // never needs a code change to relabel its own table.
  itemLabel: string;
  priceLabel: string;
  column1Label: string;
  column2Label: string;
  bestForLabel: string;
  // Label on each row's action button (kept separate from the site-wide
  // "Book Now" button text since this table's cells are narrow).
  bookLabel: string;
}

// Wrapper heading above the FAQ accordion — see components/FAQSection.tsx.
// The questions/answers themselves are separately admin-editable via
// /admin/faqs (lib/data.ts's getFaqs()).
export interface FaqSection {
  heading: string;
}

// Custom 404 page — see app/not-found.tsx.
export interface NotFoundSection {
  heading: string;
  body: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

// Homepage "From the Blog" teaser section — see components/BlogSection.tsx.
// Distinct from the /blog listing page itself (BlogPageSection below).
export interface BlogTeaserSection {
  eyebrow: string;
  heading: string;
  subheading: string;
  viewAllText: string;
  readArticleText: string;
}

// The /blog listing page, plus the small wrapper labels shared by every
// blog article page (Back link, Quick Answer/Table of Contents labels,
// Related Guides/Articles headings, sidebar CTA) — see app/blog/page.tsx,
// app/blog/[slug]/page.tsx, components/QuickAnswer.tsx,
// components/TableOfContents.tsx, components/RelatedPosts.tsx, and
// components/BlogSidebar.tsx. The posts themselves are edited separately
// from /admin/posts.
export interface BlogPageSection {
  eyebrow: string;
  heading: string;
  subheading: string;
  emptyStateText: string;
  featuredLinkText: string;
  ctaHeading: string;
  ctaButtonText: string;
  backToGuidesText: string;
  quickAnswerLabel: string;
  tocLabel: string;
  relatedGuidesHeading: string;
  sidebarRelatedHeading: string;
  sidebarRecommendedBadge: string;
  sidebarCompareLinkText: string;
  // Label above the inline mid-article tour promo card — see
  // components/TourPromoCard.tsx (rendered via RecommendedTour.tsx).
  promoRecommendedText: string;
}

export interface HomepageSections {
  tours: TourSection;
  highlights: HighlightsSection;
  why: WhySection;
  tower: TowerSection;
  practical: PracticalSection;
  price: PriceSection;
  faq: FaqSection;
  notFound: NotFoundSection;
  blogTeaser: BlogTeaserSection;
  blogPage: BlogPageSection;
}

// Site-wide navbar — edited from the Homepage admin tab for simplicity,
// but rendered on every page (see components/Header.tsx).
export interface HeaderContent {
  logoImage: string; // blank = use the bundled Logo.png asset
  logoAlt: string;
  // The two-line wordmark text shown next to (or under) the logo image —
  // see components/Logo.tsx. Shown regardless of whether logoImage is set.
  logoLine1: string;
  logoLine2: string;
  // The leading "Home" crumb every Breadcrumbs trail starts with — see
  // components/Breadcrumbs.tsx.
  homeLabel: string;
  // Shared label for every "Book Now" button site-wide (tour cards, the
  // mobile sticky bar, blog sidebar) — see components/TourCard.tsx,
  // TourPromoCard.tsx, FeaturedTour.tsx, BlogSidebar.tsx.
  bookNowText: string;
  navLinks: NavLink[];
  ctaText: string;
  ctaHref: string;
}

// Site-wide footer — same "edited from Homepage, rendered everywhere" deal.
export interface FooterContent {
  tagline: string; // rich text HTML
  columns: FooterColumn[];
  addressHeading: string;
  addressLine1: string;
  addressLine2: string;
  copyrightText: string;
}

// Site-wide brand colors — blank fields fall back to the original
// hardcoded hex values (see globals.css :root), so leaving these blank
// changes nothing. See app/layout.tsx for how these become live CSS.
export interface ThemeColors {
  primary: string; // "seine-amber" — main CTA buttons
  secondary: string; // "seine-teal" — accents, links
  dark: string; // "seine-ink" — hero background
  accent: string; // "gold-400" — ratings, badges
}

export interface HomepageContent {
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt: string;
  heroGallery: GalleryImage[];
  heroCtaPrimaryText: string;
  heroCtaPrimaryHref: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryHref: string;
  ratingValue: string;
  ratingCount: string;
  // "Featured/Recommended Tour" widget — a compact sticky bar on mobile,
  // a richer showcase card on desktop. Which tour it promotes and its
  // copy are both editable from /admin/recommended.
  showFeaturedTour: boolean;
  featuredTourId: string;
  featuredBadgeLabel: string;
  featuredUrgencyText: string;
  featuredReasons: string[];
  // Everything below the hero — What You See, Illuminations Cruise,
  // Practical Info, and the Price Comparison intro.
  sections: HomepageSections;
  // Site-wide navbar + footer (see interfaces above).
  header: HeaderContent;
  footer: FooterContent;
  // Site-wide brand colors.
  theme: ThemeColors;
  // On-page SEO title/description — falls back to the root layout's
  // site-wide defaults if left blank (see app/page.tsx generateMetadata).
  metaTitle: string;
  metaDescription: string;
  // Used only by the "Advanced SEO" tab's on-page checklist — not written
  // to any meta tag, just a helper so the person editing content can see
  // whether the phrase they're targeting actually shows up in the H1/
  // title/description.
  focusKeyword: string;
  // Search Engine Indexing toggle (admin-editable from /admin/indexing).
  // false (default) = indexable (index, follow). true = noindex, nofollow.
  noIndex: boolean;
  // Independent "Link Following" toggle — see lib/seo.ts's resolveRobots.
  noFollow: boolean;
  // Blank = auto-generate from SITE_URL + "/" (see lib/seo.ts resolveCanonical).
  canonicalUrl: string;
  // Open Graph / Twitter overrides — blank falls back to the page's own
  // title/description/hero image (see lib/seo.ts resolveOg).
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Every default below is a byte-for-byte transcription of the copy that
// used to be hardcoded directly in Header.tsx / Footer.tsx / Hero.tsx /
// WhatYouSee.tsx / IlluminationsCruise.tsx / PracticalInfo.tsx /
// PriceComparison.tsx — moving it here and having each component render
// whatever's in the (possibly-blank) database column, falling back to
// this, means the live site looks 100% identical until someone actually
// edits a field in /admin/homepage.
export const DEFAULT_HEADER: HeaderContent = {
  logoImage: "",
  logoAlt: "Seine River Cruise Tours",
  logoLine1: "Seine River",
  logoLine2: "Cruise Tours",
  homeLabel: "Home",
  bookNowText: "Book Now",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  ctaText: "Book a Cruise",
  ctaHref: "/#tours",
};

export const DEFAULT_FOOTER: FooterContent = {
  tagline:
    "<strong>Independent booking guide.</strong> Not affiliated with any Seine cruise operator — we curate sightseeing and dinner cruises from licensed operators and earn a commission on bookings made through our links, at no extra cost to you.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "River Cruises", href: "/#tours" },
        { label: "Night Cruise", href: "/#night-cruise" },
        { label: "Cruise Prices", href: "/#prices" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ],
  addressHeading: "Main Boarding Point",
  addressLine1: "Port de la Bourdonnais",
  addressLine2: "75007 Paris, France",
  copyrightText:
    "Seine River Cruise Tours. All prices shown in EUR and subject to change by the cruise operator.",
};

export const DEFAULT_THEME: ThemeColors = {
  primary: "#86198f",   // Parisian Velvet Plum
  secondary: "#f59e0b", // Radiant French Amber
  dark: "#1e0524",      // Deep Parisian Midnight Plum
  accent: "#fbbf24",    // Luminous Warm Gold
};

export const DEFAULT_GALLERY: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=900&auto=format&fit=crop",
    alt: "The Eiffel Tower and Pont d'Iéna bridge above the Seine River",
    label: "The Cruise",
  },
  {
    src: "https://images.unsplash.com/photo-1552585734-b7ae2174b8f9?q=80&w=900&auto=format&fit=crop",
    alt: "The Louvre Museum along the Seine River banks in Paris",
    label: "The Louvre",
  },
  {
    src: "https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=900&auto=format&fit=crop",
    alt: "A river cruise boat gliding past illuminated buildings on the Seine at night",
    label: "Evening Cruise",
  },
  {
    src: "https://images.unsplash.com/photo-1754407190578-21b05b79a920?q=80&w=900&auto=format&fit=crop",
    alt: "The Seine River flowing past Parisian buildings and bridges",
    label: "Riverside Paris",
  },
];

export const DEFAULT_SECTIONS: HomepageSections = {
  tours: {
    heading: "Seine River Cruises & Tickets",
    subheading:
      "Three clear options — a quick sightseeing cruise, a dinner cruise with live music, and a budget-friendly evening cruise. Every departure covers the same iconic stretch of river.",
  },
  highlights: {
    eyebrow: "Why the Seine",
    heading: "Seine River Highlights",
    subheading:
      "The Seine isn't just a way to get between landmarks — it's a viewpoint on its own. Here's what makes the ride itself worth booking.",
    cards: [
      {
        title: "Iconic Waterfront",
        body: "The Eiffel Tower, Musée d'Orsay, and the Louvre all sit directly on the water — no other viewpoint in Paris strings them together in one hour.",
        icon: "🗼",
      },
      {
        title: "Notre-Dame & Île de la Cité",
        body: "Every route loops around the island where Paris began, passing Notre-Dame Cathedral and the Conciergerie from the river.",
        icon: "⛪",
      },
      {
        title: "Open-Air Decks",
        body: "Evening and combo cruises open their upper decks so you can feel the river air and get an unobstructed line of sight for photos.",
        icon: "🌬️",
      },
      {
        title: "Evening Glow",
        body: "After sunset, every bridge and monument is floodlit, and the Eiffel Tower sparkles for five minutes on the hour, every hour.",
        icon: "✨",
      },
    ],
  },
  why: {
    heading: "What You Actually See on a Seine River Cruise",
    intro:
      "One hour, one loop, and more of Paris's skyline than you could comfortably reach on foot in an afternoon. Here's the route, landmark by landmark.",
    timelineHeading: "Sample cruise route",
    timeline: [
      { time: "0:00", step: "Depart Port de la Bourdonnais, with the Eiffel Tower directly overhead" },
      { time: "0:08", step: "Pass under Pont Alexandre III — the most ornate, gold-leafed bridge on the river" },
      { time: "0:18", step: "Musée d'Orsay and the Tuileries Garden slide by on the Right Bank" },
      { time: "0:28", step: "The Louvre and Pont Neuf — the oldest bridge in Paris, despite the name" },
      { time: "0:38", step: "Île de la Cité and Notre-Dame Cathedral — the turnaround point" },
      { time: "0:50", step: "Return past the Conciergerie and Paris City Hall (Hôtel de Ville)" },
    ],
    learnHeading: "What you'll notice",
    learn: [
      "Why the Eiffel Tower sparkles for five minutes every hour after dark",
      "Why \"Pont Neuf\" (New Bridge) is actually the oldest bridge still standing in Paris",
      "How the banks of the Seine became a UNESCO World Heritage Site",
      "Which of the 30+ bridges you'll pass under has the best photo angle from the water",
    ],
    note: "Cruises run with multilingual audio commentary (up to 10+ languages), so you always know what you're looking at as it passes. Boats have covered indoor seating, so weather rarely cancels a departure.",
    extraHeading: "Where you can board",
    extraItems: [
      { name: "Port de la Bourdonnais", note: "At the foot of the Eiffel Tower — the main dock for most sightseeing and evening cruises" },
      { name: "Pont de l'Alma", note: "A short walk from the Champs-Élysées, used by several evening and combo departures" },
      { name: "Pont Neuf", note: "On Île de la Cité, closest if you're starting near Notre-Dame or the Louvre" },
    ],
    ctaText: "Convinced? The 1-hour sightseeing cruise starts at €17/person and departs every 30–45 minutes.",
    ctaButtonText: "Book the Sightseeing Cruise →",
    ctaHref: "#tours",
  },
  tower: {
    eyebrow: "Evening Cruise with Live Music",
    heading: "See Paris Sparkle After Dark",
    body:
      "The same one-hour route looks completely different once the sun goes down. Every bridge and monument along the Seine is floodlit at night, the <strong>Eiffel Tower sparkles for five minutes on the hour</strong>, and the evening departure adds live onboard music with open-air deck seating — a slower, more atmospheric ride than the daytime sightseeing cruise, for a similar price.",
    bullets: [
      "Live onboard music and open-air deck access, included in the evening ticket",
      "Every bridge and monument is floodlit — a completely different atmosphere from the daytime route",
      "Weekend evening slots book out first, especially in summer",
      "Best light for photos: the 20 minutes right after sunset, before it's fully dark",
    ],
    ctaButtonText: "See Evening Cruise with Music",
    ctaHref: "#tours",
    images: [
      {
        src: "https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=700&auto=format&fit=crop",
        alt: "A river cruise boat gliding past illuminated buildings on the Seine at night",
        label: "Evening Cruise",
      },
      {
        src: "https://images.unsplash.com/photo-1760281853031-7d82263729b6?q=80&w=700&auto=format&fit=crop",
        alt: "The Eiffel Tower glowing above the Seine River at golden hour",
        label: "Eiffel Tower at Dusk",
      },
      {
        src: "https://images.unsplash.com/photo-1754407190578-21b05b79a920?q=80&w=700&auto=format&fit=crop",
        alt: "The Seine River flowing past Parisian buildings and bridges",
        label: "Along the River",
      },
      {
        src: "https://images.unsplash.com/photo-1552585734-b7ae2174b8f9?q=80&w=700&auto=format&fit=crop",
        alt: "The Louvre Museum along the Seine River banks in Paris",
        label: "City Lights",
      },
    ],
  },
  practical: {
    hoursHeading: "Cruise Schedule (2026)",
    hours: [
      { range: "November – February", time: "10:15 AM – 10:00 PM" },
      { range: "March", time: "10:15 AM – 10:30 PM" },
      { range: "April – September", time: "10:00 AM – 11:00 PM" },
      { range: "October", time: "10:15 AM – 10:30 PM" },
    ],
    hoursNote: "Departures every 30–45 minutes; exact times vary by operator.",
    addressHeading: "Boarding Points",
    address:
      "Port de la Bourdonnais — 75007, at the Eiffel Tower. RER C (Champ de Mars / Tour Eiffel) or Métro 6 (Bir-Hakeim).\nPont de l'Alma — near the Champs-Élysées, used by several evening departures.\nPont Neuf — Île de la Cité, closest to Notre-Dame and the Louvre.",
    metro: "Arrive 15–20 minutes early — your confirmation email lists the exact dock number.",
    bestTimeHeading: "Best Time for a Cruise",
    bestTimeBody:
      "The hour before sunset gets you daylight on the way out and illuminated bridges on the way back. Book weekday mornings for the shortest boarding lines — June through August is peak season.",
  },
  price: {
    heading: "Compare & Choose Your Cruise",
    subheading:
      "All four options side by side — pick the one that fits your trip, then book straight from the table.",
    note: "Children under 4 typically ride free; children, students, and family bundles get reduced rates on most cruises — check each ticket's booking page for exact tiers.",
    itemLabel: "Cruise Type",
    priceLabel: "Price",
    column1Label: "Duration",
    column2Label: "Meal Included",
    bestForLabel: "Best For",
    bookLabel: "Book",
  },
  faq: {
    heading: "Seine River Cruise FAQs",
  },
  notFound: {
    heading: "Looks like this page missed the boat.",
    body: "The page you're looking for doesn't exist or may have moved. Try one of these instead.",
    primaryButtonText: "Compare River Cruises & Tickets →",
    primaryButtonHref: "/#tours",
    secondaryButtonText: "Read the Travel Guide",
    secondaryButtonHref: "/blog",
  },
  blogTeaser: {
    eyebrow: "From the Blog",
    heading: "Seine River Cruise Guides & Tips",
    subheading:
      "Expert advice, dinner cruise comparisons, and insider tips to help you plan your Paris river experience.",
    viewAllText: "View All Articles",
    readArticleText: "Read Article",
  },
  blogPage: {
    eyebrow: "River Cruise Blog",
    heading: "Seine River Cruise Travel Guide",
    subheading: "Practical guides to help you plan your visit and pick the right cruise.",
    emptyStateText: "No articles published yet — check back soon.",
    featuredLinkText: "Read the guide",
    ctaHeading: "Ready to book your Seine River cruise?",
    ctaButtonText: "Compare Seine River Cruises & Tickets →",
    backToGuidesText: "← All guides",
    quickAnswerLabel: "Quick Answer",
    tocLabel: "In This Guide",
    relatedGuidesHeading: "Related Guides",
    sidebarRelatedHeading: "Related Articles",
    sidebarRecommendedBadge: "Recommended",
    sidebarCompareLinkText: "Compare all cruises & tickets →",
    promoRecommendedText: "Recommended for you",
  },
};

// Used only if the `homepage` table is empty or unreachable (e.g. before
// `node scripts/setup-db.mjs` has been run) — a real image rather than an
// empty string so the hero section never renders broken/blank.
const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroBadge: "⚓ Skip the line · Instant confirmation",
  heroHeading: "Seine River Cruise Tours — See Paris From the Water",
  heroSubheading:
    "Glide past the Eiffel Tower, Notre-Dame, and the Louvre on a sightseeing or dinner cruise along the Seine. Book online — instant confirmation, free cancellation on most tickets.",
  heroImage:
    "https://images.unsplash.com/photo-1774084930616-fce8eba59264?q=80&w=2400&auto=format&fit=crop",
  heroImageAlt: "The Eiffel Tower and the Seine River glowing at sunset in Paris",
  heroGallery: DEFAULT_GALLERY,
  heroCtaPrimaryText: "Compare River Cruises",
  heroCtaPrimaryHref: "#tours",
  heroCtaSecondaryText: "See Cruise Prices",
  heroCtaSecondaryHref: "#prices",
  ratingValue: "4.6 / 5",
  ratingCount: "42,000+ reviews",
  showFeaturedTour: true,
  featuredTourId: "seine-sightseeing-cruise",
  featuredBadgeLabel: "Recommended",
  featuredUrgencyText: "Best Price · Limited Availability",
  featuredReasons: [
    "Our most-booked cruise — 42,000+ reviews, averaging 4.6 stars",
    "Departs every 30–45 minutes, all day",
    "Free cancellation up to 24 hours before",
  ],
  sections: DEFAULT_SECTIONS,
  header: DEFAULT_HEADER,
  footer: DEFAULT_FOOTER,
  theme: DEFAULT_THEME,
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  noIndex: false,
  noFollow: false,
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

function parseReasons(value: unknown): string[] {
  if (Array.isArray(value)) return value;
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

// Generic "parse a JSONB column, fall back to a default object if it's
// missing/empty/malformed" helper — every *_json column on the homepage
// row (sections, header, footer, theme) goes through this, deep-merged
// with its default so adding a new field later never breaks a site that
// was already customized before that field existed.
function parseJsonWithDefault<T extends object>(value: unknown, fallback: T): T {
  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = null;
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
  return { ...fallback, ...(parsed as Partial<T>) };
}

function rowToHomepage(row: any): HomepageContent {
  const sectionsRaw = parseJsonWithDefault<HomepageSections>(row.sections_json, DEFAULT_SECTIONS);
  return {
    heroBadge: row.hero_badge || "",
    heroHeading: row.hero_heading || "",
    heroSubheading: row.hero_subheading || "",
    heroImage: row.hero_image || "",
    heroImageAlt: row.hero_image_alt || "",
    heroGallery: (() => {
      const g = parseReasons(row.hero_gallery);
      return g.length ? (g as unknown as GalleryImage[]) : DEFAULT_GALLERY;
    })(),
    heroCtaPrimaryText: row.hero_cta_primary_text || DEFAULT_HOMEPAGE_CONTENT.heroCtaPrimaryText,
    heroCtaPrimaryHref: row.hero_cta_primary_href || DEFAULT_HOMEPAGE_CONTENT.heroCtaPrimaryHref,
    heroCtaSecondaryText: row.hero_cta_secondary_text || DEFAULT_HOMEPAGE_CONTENT.heroCtaSecondaryText,
    heroCtaSecondaryHref: row.hero_cta_secondary_href || DEFAULT_HOMEPAGE_CONTENT.heroCtaSecondaryHref,
    ratingValue: row.rating_value || "",
    ratingCount: row.rating_count || "",
    showFeaturedTour: !!row.show_featured_tour,
    featuredTourId: row.featured_tour_id || "",
    featuredBadgeLabel: row.featured_badge_label || "",
    featuredUrgencyText: row.featured_urgency_text || "",
    featuredReasons: parseReasons(row.featured_reasons),
    sections: {
      tours: { ...DEFAULT_SECTIONS.tours, ...sectionsRaw.tours },
      highlights: { ...DEFAULT_SECTIONS.highlights, ...sectionsRaw.highlights },
      why: { ...DEFAULT_SECTIONS.why, ...sectionsRaw.why },
      tower: { ...DEFAULT_SECTIONS.tower, ...sectionsRaw.tower },
      practical: { ...DEFAULT_SECTIONS.practical, ...sectionsRaw.practical },
      price: { ...DEFAULT_SECTIONS.price, ...sectionsRaw.price },
      faq: { ...DEFAULT_SECTIONS.faq, ...sectionsRaw.faq },
      notFound: { ...DEFAULT_SECTIONS.notFound, ...sectionsRaw.notFound },
      blogTeaser: { ...DEFAULT_SECTIONS.blogTeaser, ...sectionsRaw.blogTeaser },
      blogPage: { ...DEFAULT_SECTIONS.blogPage, ...sectionsRaw.blogPage },
    },
    header: parseJsonWithDefault<HeaderContent>(row.header_json, DEFAULT_HEADER),
    footer: parseJsonWithDefault<FooterContent>(row.footer_json, DEFAULT_FOOTER),
    theme: parseJsonWithDefault<ThemeColors>(row.theme_json, DEFAULT_THEME),
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    focusKeyword: row.focus_keyword || "",
    noIndex: !!row.no_index,
    noFollow: !!row.no_follow,
    canonicalUrl: row.canonical_url || "",
    ogTitle: row.og_title || "",
    ogDescription: row.og_description || "",
    ogImage: row.og_image || "",
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const rows = await sql`SELECT * FROM homepage WHERE id = 1 LIMIT 1`;
    return rows.length ? rowToHomepage(rows[0]) : DEFAULT_HOMEPAGE_CONTENT;
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

// Lightweight version of the above for Header/Footer/RootLayout, which
// render on every single page (not just the homepage) and only need the
// three site-wide columns — avoids pulling the full hero/sections payload
// on every page load just to read the navbar.
export async function getSiteChrome(): Promise<{ header: HeaderContent; footer: FooterContent; theme: ThemeColors }> {
  try {
    const rows = await sql`SELECT header_json, footer_json, theme_json FROM homepage WHERE id = 1 LIMIT 1`;
    if (!rows.length) return { header: DEFAULT_HEADER, footer: DEFAULT_FOOTER, theme: DEFAULT_THEME };
    const row = rows[0] as any;
    return {
      header: parseJsonWithDefault<HeaderContent>(row.header_json, DEFAULT_HEADER),
      footer: parseJsonWithDefault<FooterContent>(row.footer_json, DEFAULT_FOOTER),
      theme: parseJsonWithDefault<ThemeColors>(row.theme_json, DEFAULT_THEME),
    };
  } catch {
    return { header: DEFAULT_HEADER, footer: DEFAULT_FOOTER, theme: DEFAULT_THEME };
  }
}

// The Homepage admin page (/admin/homepage) is now one tabbed form, but
// still deliberately only ever PUTs the columns it owns — NOT
// featured_tour_* (owned by /admin/recommended) and NOT no_index/no_follow
// (owned by /admin/indexing) — so those two pages can never be clobbered
// by a stale snapshot sitting in this form, no matter which was saved most
// recently. See setHomepageIndexing/saveRecommendedTour below for the
// other two column-scoped save functions this splits against.
export async function saveHomepageCopy(data: {
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt: string;
  heroGallery: GalleryImage[];
  heroCtaPrimaryText: string;
  heroCtaPrimaryHref: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryHref: string;
  ratingValue: string;
  ratingCount: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}): Promise<void> {
  await sql`
    INSERT INTO homepage (
      id, hero_badge, hero_heading, hero_subheading, hero_image, hero_image_alt,
      hero_gallery, hero_cta_primary_text, hero_cta_primary_href,
      hero_cta_secondary_text, hero_cta_secondary_href,
      rating_value, rating_count, meta_title, meta_description, focus_keyword,
      canonical_url, og_title, og_description, og_image
    ) VALUES (
      1, ${data.heroBadge}, ${data.heroHeading}, ${data.heroSubheading}, ${data.heroImage},
      ${data.heroImageAlt}, ${JSON.stringify(data.heroGallery || [])}::jsonb,
      ${data.heroCtaPrimaryText || ""}, ${data.heroCtaPrimaryHref || ""},
      ${data.heroCtaSecondaryText || ""}, ${data.heroCtaSecondaryHref || ""},
      ${data.ratingValue}, ${data.ratingCount},
      ${data.metaTitle || ""}, ${data.metaDescription || ""}, ${data.focusKeyword || ""},
      ${data.canonicalUrl || ""}, ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_badge = EXCLUDED.hero_badge,
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      hero_image = EXCLUDED.hero_image,
      hero_image_alt = EXCLUDED.hero_image_alt,
      hero_gallery = EXCLUDED.hero_gallery,
      hero_cta_primary_text = EXCLUDED.hero_cta_primary_text,
      hero_cta_primary_href = EXCLUDED.hero_cta_primary_href,
      hero_cta_secondary_text = EXCLUDED.hero_cta_secondary_text,
      hero_cta_secondary_href = EXCLUDED.hero_cta_secondary_href,
      rating_value = EXCLUDED.rating_value,
      rating_count = EXCLUDED.rating_count,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      focus_keyword = EXCLUDED.focus_keyword,
      canonical_url = EXCLUDED.canonical_url,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image
  `;
}

// Touches ONLY the indexing columns — used by the centralized "Indexing"
// admin tab (/admin/indexing) so flipping this page's Index/Follow toggle
// there can never clobber the Homepage form's content or vice versa,
// no matter which was saved most recently.
export async function setHomepageIndexing(noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`
    INSERT INTO homepage (id, no_index, no_follow)
    VALUES (1, ${!!noIndex}, ${!!noFollow})
    ON CONFLICT (id) DO UPDATE SET
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow
  `;
}

// Mirror image of saveHomepageCopy above — only touches the Recommended
// Tour widget's own columns, leaving the Homepage page's hero copy alone.
export async function saveRecommendedTour(data: {
  showFeaturedTour: boolean;
  featuredTourId: string;
  featuredBadgeLabel: string;
  featuredUrgencyText: string;
  featuredReasons: string[];
}): Promise<void> {
  await sql`
    INSERT INTO homepage (
      id, show_featured_tour, featured_tour_id, featured_badge_label,
      featured_urgency_text, featured_reasons
    ) VALUES (
      1, ${!!data.showFeaturedTour}, ${data.featuredTourId}, ${data.featuredBadgeLabel},
      ${data.featuredUrgencyText}, ${JSON.stringify(data.featuredReasons || [])}::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      show_featured_tour = EXCLUDED.show_featured_tour,
      featured_tour_id = EXCLUDED.featured_tour_id,
      featured_badge_label = EXCLUDED.featured_badge_label,
      featured_urgency_text = EXCLUDED.featured_urgency_text,
      featured_reasons = EXCLUDED.featured_reasons
  `;
}

// Touches ONLY sections_json — the "What You See" / "Illuminations
// Cruise" / "Practical Info" / "Price Comparison" content.
export async function saveHomepageSections(sections: HomepageSections): Promise<void> {
  await sql`
    INSERT INTO homepage (id, sections_json)
    VALUES (1, ${JSON.stringify(sections)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET sections_json = EXCLUDED.sections_json
  `;
}

// Touches ONLY header_json — the site-wide navbar (logo, nav links, CTA
// button). Renders on every page, edited from the Homepage admin tab.
export async function saveSiteHeader(header: HeaderContent): Promise<void> {
  await sql`
    INSERT INTO homepage (id, header_json)
    VALUES (1, ${JSON.stringify(header)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET header_json = EXCLUDED.header_json
  `;
}

// Touches ONLY footer_json — the site-wide footer.
export async function saveSiteFooter(footer: FooterContent): Promise<void> {
  await sql`
    INSERT INTO homepage (id, footer_json)
    VALUES (1, ${JSON.stringify(footer)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET footer_json = EXCLUDED.footer_json
  `;
}

// Touches ONLY theme_json — the site-wide brand colors.
export async function saveSiteTheme(theme: ThemeColors): Promise<void> {
  await sql`
    INSERT INTO homepage (id, theme_json)
    VALUES (1, ${JSON.stringify(theme)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET theme_json = EXCLUDED.theme_json
  `;
}
