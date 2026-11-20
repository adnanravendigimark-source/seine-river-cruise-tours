import { getTours } from "@/lib/data";
import { getHomepageContent, affiliateNoteText } from "@/lib/homepage";

// Last booking band before the footer. The main button books the featured
// tour (its own link and button text); copy is editable from /admin/homepage
// → Content (lib/homepage.ts → sections.finalCta).
export default async function FinalCta() {
  const [tours, content] = await Promise.all([getTours(), getHomepageContent()]);
  const s = content.sections.finalCta;
  const tour = tours.find((t) => t.id === content.featuredTourId) || tours[0];
  if (!tour || !s.heading.trim()) return null;

  return (
    <section className="bg-seine-ink py-16 text-white sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{s.heading}</h2>
          <p className="mt-3 text-white/85">{s.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <a
            href={tour.href}
            target="_blank"
            rel="noopener nofollow sponsored"
            data-placement="final_cta"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-seine-amber px-7 text-sm font-semibold text-white transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {tour.ctaLabel || content.header.bookNowText}
            <span className="sr-only"> for {tour.title} (opens GetYourGuide in a new tab)</span>
          </a>
          {s.secondaryText && /^(#|\/(?!\/))/.test(s.secondaryHref.trim()) && (
            <a
              href={s.secondaryHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {s.secondaryText}
            </a>
          )}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-white/70 sm:px-6">{affiliateNoteText(content.header)}</p>
    </section>
  );
}
