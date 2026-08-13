import SafeImage from "./SafeImage";
import type { Tour } from "@/lib/data";

// The actual card markup for the inline "Recommended Tour" promo dropped
// mid-article — pulled out of RecommendedTour.tsx so it can be reused
// wherever a `Tour` object is already in hand (RecommendedTour.tsx itself,
// an async Server Component, fetches the tour by id and renders this; the
// admin's live post preview already has the full tours list as a prop, so
// it renders this directly with zero extra fetching, keeping the preview
// pixel-identical to the real page without needing a Server Component
// inside a client-side form).
export default function TourPromoCard({ tour }: { tour: Tour }) {
  return (
    <div className="my-8 flex flex-col gap-5 overflow-hidden rounded-2xl border border-seine-teal/20 bg-seine-teal/5 p-5 sm:flex-row sm:items-center">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40">
        <SafeImage src={tour.image} alt={tour.imageAlt} fill sizes="200px" className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-seine-teal">Recommended for you</p>
        <p className="mt-1 font-display text-base font-semibold text-stone-900">{tour.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-stone-900/60">
          <span className="text-gold-500">★</span>
          {tour.rating.toFixed(1)} ({tour.reviews.toLocaleString()}) · from €{tour.price}/person
        </div>
      </div>
      <a
        href={tour.href}
        target="_blank"
        rel="noopener nofollow sponsored"
        className="shrink-0 rounded-full bg-seine-amber px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-seine-amber/90"
      >
        Book Now
      </a>
    </div>
  );
}
