"use client";

import QuickAnswer from "@/components/QuickAnswer";
import SafeImage from "@/components/SafeImage";
import TourPromoCard from "@/components/TourPromoCard";
import { SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/posts";
import type { Tour } from "@/lib/data";

// A live, pixel-faithful mirror of the real /blog/[slug] article layout —
// reuses the exact same components (QuickAnswer, SafeImage, TourPromoCard)
// and Tailwind classes as app/blog/[slug]/page.tsx, just fed straight from
// the form's in-memory `post` state instead of a database read. Because
// it's driven by the same React state every field in PostForm already
// updates on every keystroke, this needs no save, no refresh, and no
// network round-trip to stay in sync — it just re-renders.
//
// The one thing it can't reuse directly is BlogPostBody's block loop: that
// component renders <RecommendedTour> (an async Server Component that
// fetches from the database), which can't be mounted inside a client
// component tree. This duplicates that loop using TourPromoCard directly
// against the `tours` list PostForm already has in memory — same visual
// output, zero fetching.
export default function BlogPostPreview({ post, tours }: { post: Post; tours: Tour[] }) {
  const recommendedTour = tours.find((t) => t.id === post.recommendedTourId);
  const displayUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/blog/${post.slug || "…"}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-100 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-2 truncate rounded-md bg-white px-2.5 py-1 text-xs text-stone-500 ring-1 ring-stone-200">
          {displayUrl}
        </span>
      </div>

      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-seine-teal">
            <span>{post.category || "Category"}</span>
            <span className="h-1 w-1 rounded-full bg-stone-900/20" />
            <span className="text-stone-900/40">{post.readTime || "Read time"}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-stone-900">
            {post.title || "Untitled post"}
          </h1>
          <div className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-2xl">
            <SafeImage src={post.image} alt={post.imageAlt} fill sizes="600px" className="object-cover" />
          </div>
        </div>

        <div className="px-6 pb-8 pt-6">
          {post.quickAnswer && <QuickAnswer>{post.quickAnswer}</QuickAnswer>}

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-stone-900/80">
            {post.content.map((block, i) => (
              <div key={i}>
                {block.type === "heading" &&
                  (block.level === 3 ? (
                    <h3 className="font-display text-base font-semibold text-stone-900">{block.text}</h3>
                  ) : (
                    <h2 className="font-display text-lg font-semibold text-stone-900">{block.text}</h2>
                  ))}

                {block.type === "paragraph" && (
                  <div className="rich-content max-w-none" dangerouslySetInnerHTML={{ __html: block.text || "" }} />
                )}

                {block.type === "list" &&
                  (block.ordered ? (
                    <ol className="list-decimal space-y-1.5 pl-5">
                      {(block.items || []).map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc space-y-1.5 pl-5">
                      {(block.items || []).map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ))}

                {block.type === "image" && block.src && (
                  <figure className="my-2">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                      <SafeImage src={block.src} alt={block.alt || ""} fill sizes="600px" className="object-cover" />
                    </div>
                    {block.caption && (
                      <figcaption className="mt-2 text-center text-xs text-stone-500">{block.caption}</figcaption>
                    )}
                  </figure>
                )}

                {post.recommendedTourAfterBlock === i + 1 && recommendedTour && (
                  <TourPromoCard tour={recommendedTour} />
                )}
              </div>
            ))}
            {post.content.length === 0 && (
              <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
                Article content will appear here as you write it.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-seine-teal/20 bg-seine-teal/5 p-5">
            <p className="text-sm font-semibold text-stone-900">{post.ctaHeading || "Ready to book?"}</p>
            <p className="mt-1 text-sm text-stone-900/70">{post.ctaBody}</p>
            <span className="mt-3 inline-flex rounded-full bg-seine-amber px-4 py-2 text-sm font-semibold text-white">
              {post.ctaButtonText || "See Price Comparison"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
