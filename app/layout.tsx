import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { resolveRobots } from "@/lib/seo";
import "./globals.css";

// Forces every page in the app to render dynamically, root layout included
// — most pages already set this individually for CMS-freshness reasons,
// but About/Contact didn't, which would let their metadata (and therefore
// the search-indexing toggle below) get cached at build time instead of
// re-checked on every request. Setting it here at the root guarantees the
// toggle takes effect immediately everywhere, no rebuild required.
export const dynamic = "force-dynamic";

// Real display typeface, loaded once here and exposed as a CSS variable so
// every font-display usage site-wide (headings, the logo wordmark) picks
// it up automatically.
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// SEO: title + description written to target "Seine river cruise" and
// "Seine dinner cruise" alongside "tickets" — keep this unique per page as
// you add more landing pages.
//
// metadataBase MUST be your real deployed domain — it's used to resolve
// canonical URLs and OG image URLs. Update this in lib/site.ts once you
// attach a custom domain in Vercel.

// Default social-share image — used whenever a page doesn't set its own
// (blog posts override this with their own photo in generateMetadata).
// Without this, links shared to WhatsApp/iMessage/Facebook/Twitter show no
// preview image at all, which measurably hurts click-through on shared
// links — a big deal for a site that depends on organic + social traffic.
const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1760281853031-7d82263729b6?q=80&w=2400&auto=format&fit=crop";

// Organization + WebSite structured data — site-wide brand identity signal
// for Google (E-E-A-T). Deliberately NOT a TouristAttraction/LocalBusiness
// schema for any single cruise operator — this site is an independent
// affiliate guide, not the official operator, and the footer disclaimer
// says so; schema claiming to BE the attraction would misrepresent that.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Seine River Cruise Tours",
  url: SITE_URL,
  description:
    "Independent guide comparing Seine River sightseeing cruises, dinner cruises, and evening illuminations cruises from licensed operators in Paris.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Seine River Cruise Tours",
  url: SITE_URL,
};

// Search indexing is controlled entirely by each page's own "Search
// Engine Indexing" admin toggle, resolved via lib/seo.ts's
// resolveRobots(). This root layout has no page of its own, so it
// resolves with no noIndex (false, i.e. index/follow) — every public
// page below it either inherits this default (if it doesn't define its
// own `robots`) or overrides it with its own resolveRobots() call (if it
// has a per-page toggle — see app/page.tsx, app/about/page.tsx,
// app/contact/page.tsx, app/blog/**, app/privacy-policy/page.tsx).
export function generateMetadata(): Metadata {
  const robots = resolveRobots(false);

  return {
    metadataBase: new URL(SITE_URL),
    // Kept under 60 characters so Google doesn't truncate it in results.
    title: {
      default: "Seine River Cruise Tours & Tickets (2026)",
      template: "%s | Seine River Cruise Tours",
    },
    // Kept under 155 characters for the same reason.
    description:
      "Compare Seine River sightseeing cruises, dinner cruises, and evening illuminations cruises in Paris. Instant online booking, free cancellation on most tickets.",
    keywords: [
      // Core high-volume terms
      "Seine River cruise Paris",
      "Paris river cruise",
      // Experience-based high-intent
      "Seine River dinner cruise",
      "Seine River cruise with Eiffel Tower",
      "Paris night cruise Seine",
      // Comparison/informational intent
      "sightseeing cruise vs dinner cruise Paris",
      "best Seine River cruise",
      // Booking intent
      "book Seine River cruise online",
      "Seine River cruise tickets 2026",
      // Budget angle
      "cheap Seine River cruise Paris",
    ],
    alternates: {
      canonical: "/",
    },
    robots,
    openGraph: {
      title: "Seine River Cruise Tours & Tickets | Sightseeing + Dinner Cruises",
      description:
        "Sightseeing, dinner, and evening illuminations cruises on the Seine. Compare prices and book online in Paris.",
      type: "website",
      url: SITE_URL,
      siteName: "Seine River Cruise Tours",
      images: [{ url: DEFAULT_OG_IMAGE, width: 2400, height: 1350, alt: "The Eiffel Tower and the Seine River at sunset" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Seine River Cruise Tours & Tickets | Sightseeing + Dinner Cruises",
      description:
        "Sightseeing, dinner, and evening illuminations cruises on the Seine. Compare prices and book online in Paris.",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body className="font-body bg-stone-50 text-stone-900 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
