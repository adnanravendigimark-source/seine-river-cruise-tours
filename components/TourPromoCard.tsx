import SafeImage from "./SafeImage";
import ProviderRating from "./ProviderRating";
import { hasPrice, type Tour } from "@/lib/data";

// The booking box used inside guides (right after the Quick Answer) and in
// the admin's live preview. Rating is credited to the booking provider;
// cancellation terms show only when the tour record has them.
export default function TourPromoCard({
  tour,
  recommendedLabel = "Recommended for you",
  bookNowText = "Book Now",
  affiliateNote = "",
}: {
  tour: Tour;
  recommendedLabel?: string;
  bookNowText?: string;
  affiliateNote?: string;
}) {
  return (
    <div className="my-8 rounded-2xl border border-seine-amber/20 bg-seine-amber/5 p-4 sm:p-5">
      <div className="flex items-start gap-4 sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-32">
          <SafeImage src={tour.image} alt={tour.imageAlt} fill sizes="128px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-seine-amber">{recommendedLabel}</p>
          <p className="mt-1 font-display text-base font-semibold leading-snug text-stone-900">{tour.title}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-900/70">
            <ProviderRating rating={tour.rating} reviews={tour.reviews} source={tour.ratingSource} />
            {tour.duration && <span>{tour.duration}</span>}
          </p>
          {tour.cancellation && <p className="mt-1 text-xs font-medium text-seine-amber">{tour.cancellation}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {hasPrice(tour) ? (
          <p className="text-sm text-stone-900">
            <span className="text-xs text-stone-900/65">from </span>
            <span className="font-semibold">€{tour.price}</span>
            <span className="text-xs text-stone-900/65"> per person</span>
          </p>
        ) : (
          <p className="text-sm text-stone-900/70">See prices on GetYourGuide</p>
        )}
        <a
          href={tour.href}
          target="_blank"
          rel="noopener nofollow sponsored"
          data-placement="post_promo"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-seine-amber px-6 text-sm font-semibold text-white transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber"
        >
          {tour.ctaLabel || bookNowText}
          <span className="sr-only"> for {tour.title} (opens GetYourGuide in a new tab)</span>
        </a>
      </div>
      {affiliateNote && <p className="mt-2 text-xs text-stone-900/65">{affiliateNote}</p>}
    </div>
  );
}
