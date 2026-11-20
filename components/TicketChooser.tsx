import { getTours } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";
import TourCard from "./TourCard";
import PriceComparison from "./PriceComparison";
import TicketChooserPicker from "./TicketChooserPicker";

// "Which cruise should I book?" — the homepage's decision section, right
// under the hero: a "What matters most to you?" picker, the bookable cards,
// and the side-by-side table. Copy comes from existing admin fields: the
// Tours section heading/subheading and each tour's "Best for" text.
export default async function TicketChooser() {
  const [tours, content] = await Promise.all([getTours(), getHomepageContent()]);
  if (tours.length === 0) return null;

  const recommendedId = content.showFeaturedTour ? content.featuredTourId : "";
  const ordered = recommendedId
    ? [...tours].sort((a, b) => (a.id === recommendedId ? -1 : b.id === recommendedId ? 1 : 0))
    : tours;
  const defaultId = ordered.some((t) => t.id === recommendedId) ? recommendedId : ordered[0].id;

  const cards = Object.fromEntries(
    ordered.map((tour) => [
      tour.id,
      <TourCard
        key={tour.id}
        tour={tour}
        bookNowText={content.header.bookNowText}
        recommended={
          tour.id === recommendedId
            ? {
                badgeLabel: content.featuredBadgeLabel,
                reasons: content.featuredReasons,
                urgencyText: content.featuredUrgencyText,
              }
            : undefined
        }
      />,
    ])
  );

  return (
    <section id="tours" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="min-w-0 font-display text-3xl font-bold leading-tight text-stone-900 [overflow-wrap:break-word] sm:text-4xl lg:col-span-7">
            {content.sections.tours.heading}
          </h2>
          <div className="lg:col-span-5">
            <p className="text-stone-900/70">{content.sections.tours.subheading}</p>
            <a
              href="#prices"
              className="mt-4 hidden rounded-full border-2 border-seine-amber px-5 py-2 text-sm font-semibold text-seine-amber transition-colors duration-150 hover:bg-seine-amber hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber sm:inline-flex"
            >
              {content.sections.price.heading}
            </a>
          </div>
        </div>

        <TicketChooserPicker
          options={ordered.map((t) => ({ id: t.id, label: t.ribbon || t.bestFor || t.title }))}
          cards={cards}
          defaultId={defaultId}
          question="What kind of cruise are you after?"
          matchLabel="Your match"
        />
      </div>

      <PriceComparison embedded />
    </section>
  );
}
