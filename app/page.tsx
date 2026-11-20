import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RiverHighlights from "@/components/RiverHighlights";
import FeaturedTour from "@/components/FeaturedTour";
import TicketChooser from "@/components/TicketChooser";
import PlanYourVisit from "@/components/PlanYourVisit";
import FinalCta from "@/components/FinalCta";
import WhatYouSee from "@/components/WhatYouSee";
import IlluminationsCruise from "@/components/IlluminationsCruise";
import PracticalInfo from "@/components/PracticalInfo";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import { getTours } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";
import { resolveRobots, resolveCanonical, resolveOg, stripHtml } from "@/lib/seo";

// Content (hero copy, tours, FAQs) lives in /data and is editable from
// /admin — render dynamically so edits show up without a rebuild.

// title/description are left unset so they inherit the root layout's
// defaults — but canonical, robots, and OG are always set here from the
// homepage's own admin-editable fields (lib/homepage.ts) so an admin
// override always wins over the layout's hardcoded fallback.
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageContent();
  const og = resolveOg(
    { ogTitle: homepage.ogTitle, ogDescription: homepage.ogDescription, ogImage: homepage.ogImage },
    { title: homepage.heroHeading, description: stripHtml(homepage.heroSubheading), image: homepage.heroImage }
  );
  return {
    // Left unset when blank so the page inherits the root layout's
    // default title/description — an admin-entered SEO Title/Meta
    // Description (Homepage → SEO tab) always overrides that default.
    ...(homepage.metaTitle.trim() ? { title: homepage.metaTitle } : {}),
    ...(homepage.metaDescription.trim() ? { description: homepage.metaDescription } : {}),
    alternates: { canonical: resolveCanonical("/", homepage.canonicalUrl) },
    robots: resolveRobots(homepage.noIndex, homepage.noFollow),
    openGraph: { title: og.title, description: og.description, url: "/", images: og.image ? [{ url: og.image }] : undefined },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function HomePage() {
  // Structured data for this page. Deliberately no Product/AggregateRating:
  // the cruises are sold by GetYourGuide, not this site, and Google's review
  // snippet rules don't allow marking up ratings collected elsewhere. The
  // river is what the page is about; the cruises are listed by name and link.
  const tours = await getTours();
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    about: {
      "@type": "TouristAttraction",
      name: "Seine River cruises in Paris",
      containedInPlace: { "@type": "City", name: "Paris", sameAs: "https://en.wikipedia.org/wiki/Paris" },
      sameAs: ["https://en.wikipedia.org/wiki/Seine"],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tours.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: t.href })),
    },
  };

  return (
    <>
      <Header overlay />
      <main>
        <Hero />
        <FeaturedTour />
        <TicketChooser />
        <WhatYouSee />
        <IlluminationsCruise />
        <RiverHighlights />
        <PlanYourVisit />
        <PracticalInfo />
        <BlogSection />
        <FAQSection />
        <FinalCta />
        {/* Spacer so the mobile sticky booking bar never covers the footer */}
        <div className="h-20 sm:hidden" aria-hidden="true" />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
