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
import { resolveRobots } from "@/lib/seo";

// Content (hero copy, tours, FAQs) lives in /data and is editable from
// /admin — render dynamically so edits show up without a rebuild.
export const dynamic = "force-dynamic";

// Only overrides `robots` here — every other metadata field (title,
// description, OG, Twitter, canonical) is left unset so it's inherited
// from the root layout as before. See lib/seo.ts for why `robots` can't
// just be inherited once a page needs its own per-page value.
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageContent();
  return { robots: resolveRobots(homepage.noIndex) };
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
      description: t.description,
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
