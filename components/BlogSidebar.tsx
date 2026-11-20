import Link from "next/link";
import SafeImage from "./SafeImage";
import ProviderRating from "./ProviderRating";
import { getTours, hasPrice } from "@/lib/data";
import { getRelatedPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";

export default async function BlogSidebar({
  slug,
  recommendedTourId,
}: {
  slug: string;
  recommendedTourId: string;
}) {
  const [tours, related, { header, sections }] = await Promise.all([
    getTours(),
    getRelatedPosts(slug),
    getHomepageContent(),
  ]);
  const tour = tours.find((t) => t.id === recommendedTourId);
  const s = sections.blogPage;

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      {tour && (
        <div className="overflow-hidden rounded-2xl border border-stone-900/10 bg-white shadow-sm">
          <div className="relative aspect-[4/3]">
            <SafeImage src={tour.image} alt={tour.imageAlt} fill sizes="320px" className="object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
              {s.sidebarRecommendedBadge}
            </span>
          </div>
          <div className="p-5">
            <p className="font-display text-sm font-semibold leading-snug text-stone-900">
              {tour.title}
            </p>
            <p className="mt-1.5 text-xs text-stone-900/70">
              <ProviderRating rating={tour.rating} reviews={tour.reviews} source={tour.ratingSource} />
            </p>
            {tour.cancellation && <p className="mt-1 text-xs font-medium text-seine-amber">{tour.cancellation}</p>}
            <div className="mt-4 flex items-center justify-between border-t border-stone-900/10 pt-4">
              <div>
                {hasPrice(tour) ? (
                  <>
                    <p className="text-xs text-stone-900/65">from</p>
                    <p className="font-display text-lg font-bold text-stone-900">€{tour.price}</p>
                  </>
                ) : (
                  <p className="text-xs text-stone-900/70">See prices on GetYourGuide</p>
                )}
              </div>
              <a
                href={tour.href}
                target="_blank"
                rel="noopener nofollow sponsored"
                data-placement="blog_sidebar"
                className="inline-flex min-h-[40px] items-center rounded-full bg-seine-amber px-4 text-xs font-bold text-white transition-[filter] hover:brightness-110"
              >
                {tour.ctaLabel || header.bookNowText}
              </a>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-900/65">
          {s.sidebarRelatedHeading}
        </p>
        <div className="mt-4 space-y-4">
          {related.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                <SafeImage src={post.image} alt={post.imageAlt} fill sizes="80px" className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-seine-amber">
                  {post.category}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium text-stone-900 group-hover:text-seine-amber">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <a
        href="/#tours"
        className="block rounded-2xl bg-seine-teal/5 p-5 text-center text-sm font-semibold text-stone-900 transition hover:bg-seine-teal/10"
      >
        {s.sidebarCompareLinkText}
      </a>
    </aside>
  );
}
