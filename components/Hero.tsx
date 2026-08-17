import Image from "next/image";
import SafeImage from "./SafeImage";
import StarRating from "./StarRating";
import { getHomepageContent } from "@/lib/homepage";

// The hero headline/subhead/badge/rating/photo/gallery/buttons are all
// content-writer editable from /admin/homepage — this file just renders
// whatever's in there (with sensible defaults so it never looks
// broken/blank — see DEFAULT_GALLERY etc. in lib/homepage.ts).
export default async function Hero() {
  const content = await getHomepageContent();
  const gallery = content.heroGallery;
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden bg-seine-ink text-white"
    >
      {/* Full-bleed photo background */}
      <div className="absolute inset-0">
        <SafeImage
          src={content.heroImage}
          alt={content.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient scrim for text legibility + brand-tinted mosaic glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-seine-ink via-seine-ink/70 to-seine-ink/30" />
        <div className="absolute inset-0 bg-mosaic mix-blend-soft-light" aria-hidden="true" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
          {content.heroBadge}
        </p>

        <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
          {content.heroHeading}
        </h1>
        <div
          className="rich-content rich-content-invert mt-4 max-w-2xl text-base text-white/90 drop-shadow-sm sm:text-lg"
          dangerouslySetInnerHTML={{ __html: content.heroSubheading }}
        />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={content.heroCtaPrimaryHref}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/35"
          >
            {content.heroCtaPrimaryText}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={content.heroCtaSecondaryHref}
            className="rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            {content.heroCtaSecondaryText}
          </a>

          {/* Floating glass rating card */}
          <div className="ml-auto flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <div className="text-left leading-tight">
              <div className="flex items-center gap-2">
                <StarRating rating={parseFloat(content.ratingValue) || 4.5} size="sm" theme="dark" />
                <span className="text-sm font-bold text-white">{content.ratingValue}</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{content.ratingCount}</p>
            </div>
          </div>
        </div>

        {/* Photo strip — editable from Homepage → Images tab. Fixed
            (not aspect-square) height so this row stays a compact strip
            instead of growing with viewport width, which is what was
            pushing the hero taller than the viewport and forcing a scroll
            to see it. */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {gallery.map((img, i) => (
            <div
              key={img.label + i}
              className="group relative h-20 overflow-hidden rounded-2xl border border-white/15 shadow-lg shadow-black/20 sm:h-28 lg:h-32"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <span className="absolute bottom-2 left-3 text-xs font-semibold text-white drop-shadow">
                {img.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
