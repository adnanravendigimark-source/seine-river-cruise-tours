import TourPromoCard from "./TourPromoCard";
import { getTours } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";

// Inline tour promo dropped mid-article — this is the highest-converting
// spot in a blog post, since the reader is already engaged with the exact
// question this tour answers. The actual card markup lives in
// TourPromoCard.tsx so the admin's live post preview (which already has
// every tour loaded client-side) can render the identical card without
// needing this async Server Component fetch.
export default async function RecommendedTour({ tourId }: { tourId: string }) {
  const [tours, { header, sections }] = await Promise.all([getTours(), getHomepageContent()]);
  const tour = tours.find((t) => t.id === tourId);
  if (!tour) return null;
  return (
    <TourPromoCard
      tour={tour}
      recommendedLabel={sections.blogPage.promoRecommendedText}
      bookNowText={header.bookNowText}
    />
  );
}
