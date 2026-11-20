import SafeImage from "./SafeImage";
import ProviderRating from "./ProviderRating";
import { hasPrice, type Tour } from "@/lib/data";
import { LockIcon } from "./icons";

export default function TourCard({
  tour,
  recommended,
  bookNowText = "Book Now",
}: {
  tour: Tour;
  recommended?: {
    badgeLabel: string;
    reasons: string[];
    urgencyText: string;
  };
  bookNowText?: string;
}) {
  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        recommended
          ? "border-2 border-gold-500 shadow-gold-500/10 hover:shadow-gold-500/20"
          : "border border-stone-900/8 hover:shadow-seine-ink/10"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
        <SafeImage
          src={tour.image}
          alt={tour.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

        {(recommended || tour.ribbon) && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm">
            <span className="text-[10px]">★</span>
            {recommended ? recommended.badgeLabel : tour.ribbon}
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
          <ProviderRating rating={tour.rating} reviews={tour.reviews} source={tour.ratingSource} />
        </div>
      </div>

      {/* Content — fixed-height title/description so footers align across cards */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="min-h-[2.75rem] font-display text-base font-semibold leading-snug text-stone-900 line-clamp-2">
          {tour.title}
        </h3>
        {/* line-clamp-2 on both the wrapper (covers legacy plain-text
            descriptions saved before this field became rich text — the
            text sits directly in this div) and the child selector (covers
            new descriptions, which the rich text editor always wraps in a
            <p>, and which -webkit-line-clamp otherwise won't reach through
            a block-level child). */}
        <div
          className="rich-content mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-stone-900/70 [&>p]:m-0 [&>p]:line-clamp-2"
          dangerouslySetInnerHTML={{ __html: tour.description }}
        />

        <ul className="mt-3 space-y-1">
          {tour.includes.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-stone-900/80">
              <span aria-hidden="true" className="shrink-0 font-bold text-seine-amber">✓</span>
              <span className="line-clamp-1 font-medium">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-2 flex flex-wrap gap-x-3 text-xs text-stone-900/65">
          {tour.duration && <span>{tour.duration}</span>}
          {tour.cancellation && <span className="font-medium text-seine-amber">{tour.cancellation}</span>}
        </p>

        {/* Footer pinned to the bottom of the card regardless of content above */}
        {recommended ? (
          <div className="mt-auto border-t border-gold-500/20 pt-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                {hasPrice(tour) ? (
                  <>
                    <p className="text-[11px] uppercase tracking-wide text-stone-900/65">from</p>
                    <span className="font-display text-xl font-bold text-stone-900">€{tour.price}</span>
                  </>
                ) : (
                  <p className="text-sm text-stone-900/70">See prices on GetYourGuide</p>
                )}
              </div>
              <a
                href={tour.href}
                target="_blank"
                rel="noopener nofollow sponsored"
                data-placement="tour_card"
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-seine-amber px-5 text-sm font-semibold text-white shadow-sm transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber"
              >
                {tour.ctaLabel || bookNowText}
              </a>
            </div>
            {recommended.urgencyText && (
              <p className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-seine-amber">
                <LockIcon className="h-3 w-3" /> {recommended.urgencyText}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-auto flex items-end justify-between gap-2 border-t border-stone-900/10 pt-3">
            <div>
              {hasPrice(tour) ? (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-stone-900/65">from</p>
                  <div className="flex items-baseline gap-2">
                    {tour.originalPrice && (
                      <span className="text-sm text-stone-900/65 line-through">€{tour.originalPrice}</span>
                    )}
                    <span className="font-display text-xl font-bold text-stone-900">€{tour.price}</span>
                    <span className="text-xs text-stone-900/65">/ person</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-900/70">See prices on GetYourGuide</p>
              )}
            </div>
            <a
              href={tour.href}
              target="_blank"
              rel="noopener nofollow sponsored"
                data-placement="tour_card"
              className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-seine-amber px-5 text-sm font-semibold text-white shadow-sm transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber"
            >
              {tour.ctaLabel || bookNowText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
