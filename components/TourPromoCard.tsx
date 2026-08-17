import SafeImage from "./SafeImage";
import StarRating from "./StarRating";
import type { Tour } from "@/lib/data";

export default function TourPromoCard({
  tour,
  recommendedLabel = "Recommended for you",
  bookNowText = "Book Now",
}: {
  tour: Tour;
  recommendedLabel?: string;
  bookNowText?: string;
}) {
  return (
    <div className="my-8 flex flex-col gap-5 overflow-hidden rounded-2xl border border-seine-teal/20 bg-seine-teal/5 p-5 sm:flex-row sm:items-center">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40">
        <SafeImage src={tour.image} alt={tour.imageAlt} fill sizes="200px" className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-seine-teal">{recommendedLabel}</p>
        <p className="mt-1 font-display text-base font-semibold text-stone-900">{tour.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-stone-900/60">
          <StarRating rating={tour.rating} showValue reviewCount={tour.reviews} size="xs" />
          <span>·</span>
          <span>from €{tour.price}/person</span>
        </div>
      </div>
      <a
        href={tour.href}
        target="_blank"
        rel="noopener nofollow sponsored"
        className="shrink-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-5 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30"
      >
        {bookNowText}
      </a>
    </div>
  );
}
