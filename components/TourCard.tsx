import SafeImage from "./SafeImage";
import StarRating from "./StarRating";
import type { Tour } from "@/lib/data";
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
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        recommended
          ? "border-2 border-gold-500 shadow-gold-500/10 hover:shadow-gold-500/20"
          : "border border-stone-900/8 hover:shadow-seine-ink/10"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <SafeImage
          src={tour.image}
          alt={tour.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

        {(recommended || tour.ribbon) && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
            <span className="text-[10px]">★</span>
            {recommended ? recommended.badgeLabel : tour.ribbon}
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
          <StarRating rating={tour.rating} showValue reviewCount={tour.reviews} size="xs" />
        </div>
      </div>

      {/* Content — fixed-height title/description so footers align across cards */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="min-h-[3.25rem] font-display text-base font-semibold leading-snug text-stone-900 line-clamp-2">
          {tour.title}
        </h3>
        {/* line-clamp-2 on both the wrapper (covers legacy plain-text
            descriptions saved before this field became rich text — the
            text sits directly in this div) and the child selector (covers
            new descriptions, which the rich text editor always wraps in a
            <p>, and which -webkit-line-clamp otherwise won't reach through
            a block-level child). */}
        <div
          className="rich-content mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-stone-900/60 [&>p]:m-0 [&>p]:line-clamp-2"
          dangerouslySetInnerHTML={{ __html: tour.description }}
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tour.includes.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700 ring-1 ring-stone-900/8"
            >
              <span className="text-seine-teal">✓</span>
              {item}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs font-medium text-stone-900/45">⏱ {tour.duration}</p>

        {recommended && recommended.reasons.length > 0 && (
          <div className="mt-3 rounded-lg bg-gold-500/5 px-3 py-2">
            {recommended.reasons.slice(0, 2).map((reason) => (
              <p key={reason} className="flex items-start gap-1.5 text-[11px] leading-snug text-stone-900/70">
                <span className="mt-0.5 text-seine-teal">✓</span>
                {reason}
              </p>
            ))}
          </div>
        )}

        {/* Footer pinned to the bottom of the card regardless of content above */}
        {recommended ? (
          <div className="mt-auto border-t border-gold-500/20 pt-4">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-900/40">from</p>
                <span className="font-display text-2xl font-bold text-stone-900">€{tour.price}</span>
              </div>
              <a
                href={tour.href}
                target="_blank"
                rel="noopener nofollow sponsored"
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30"
              >
                {bookNowText}
              </a>
            </div>
            {recommended.urgencyText && (
              <p className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                <LockIcon className="h-3 w-3" /> {recommended.urgencyText}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-auto flex items-end justify-between border-t border-stone-900/8 pt-5">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-stone-900/40">from</p>
              <div className="flex items-baseline gap-2">
                {tour.originalPrice && (
                  <span className="text-sm text-stone-900/35 line-through">€{tour.originalPrice}</span>
                )}
                <span className="font-display text-2xl font-bold text-stone-900">€{tour.price}</span>
                <span className="text-xs text-stone-900/45">/ person</span>
              </div>
            </div>
            <a
              href={tour.href}
              target="_blank"
              rel="noopener nofollow sponsored"
              className="rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30"
            >
              {bookNowText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
