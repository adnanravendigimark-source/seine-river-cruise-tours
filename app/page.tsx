import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RiverHighlights from "@/components/RiverHighlights";
import FeaturedTour from "@/components/FeaturedTour";
import TourGrid from "@/components/TourGrid";
import WhatYouSee from "@/components/WhatYouSee";
import IlluminationsCruise from "@/components/IlluminationsCruise";
import PracticalInfo from "@/components/PracticalInfo";
import PriceComparison from "@/components/PriceComparison";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { getTours } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";
import { resolveRobots, resolveCanonical, resolveOg, stripHtml } from "@/lib/seo";

// Content (hero copy, tours, FAQs) lives in /data and is editable from
// /admin — render dynamically so edits show up without a rebuild.
export const dynamic = "force-dynamic";

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
  // Product structured data for the featured cruises — makes them eligible
  // for star-rating rich results in search.
  const tours = await getTours();
  const productJsonLd = tours
    .filter((t) => t.featured)
    .map((t) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: t.title,
      // t.description is admin-entered rich text (bold/links/lists) —
      // structured data needs plain text, so tags are stripped here; the
      // tour card itself renders the real formatted HTML.
      description: t.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: t.rating,
        reviewCount: t.reviews,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: t.price,
        availability: "https://schema.org/InStock",
        url: t.href,
      },
    }));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <RiverHighlights />
        <FeaturedTour />
        <TourGrid />
        <WhatYouSee />
        <IlluminationsCruise />
        <PracticalInfo />
        <PriceComparison />
        <FAQSection />
        {/* Spacer so the mobile sticky booking bar never covers the footer */}
        <div className="h-20 sm:hidden" aria-hidden="true" />
      </main>
      <Footer />
      {productJsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
