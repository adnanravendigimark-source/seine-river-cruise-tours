// A third-party rating shown as plain, attributed text — e.g.
// "4.7★ · 4,850 reviews on GetYourGuide". Display only: these numbers are
// collected by the booking provider, so they never go into structured data.
export default function ProviderRating({
  rating,
  reviews,
  source,
  compact = false,
  className = "",
}: {
  rating: number;
  reviews: number;
  source?: string;
  compact?: boolean;
  className?: string;
}) {
  if (!Number.isFinite(rating) || rating <= 0) return null;
  const from = source?.trim() ? ` on ${source.trim()}` : "";
  const count = Number.isFinite(reviews) && reviews > 0 ? `${reviews.toLocaleString("en-US")} reviews` : "";
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-semibold text-stone-900">
        {rating.toFixed(1)}
        <span className="text-gold-500" aria-hidden="true">★</span>
        <span className="sr-only"> out of 5</span>
      </span>
      {compact ? (
        <span>{from ? from.trim() : count}</span>
      ) : (
        <span>
          {count ? `· ${count}` : ""}
          {from}
        </span>
      )}
    </span>
  );
}
