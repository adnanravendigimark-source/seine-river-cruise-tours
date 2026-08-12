import Image from "next/image";
import { getHomepageContent } from "@/lib/homepage";

// Content editable from /admin/homepage → Content tab (see
// lib/homepage.ts's TowerSection / DEFAULT_SECTIONS.tower).
export default async function IlluminationsCruise() {
  const { sections } = await getHomepageContent();
  const s = sections.tower;

  return (
    <section id="night-cruise" className="bg-seine-teal/5 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-seine-teal">
            {s.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-900">{s.heading}</h2>
          <p
            className="rich-content mt-4 text-stone-900/70"
            dangerouslySetInnerHTML={{ __html: s.body }}
          />
          <ul className="mt-6 space-y-3 text-sm text-stone-900/80">
            {s.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-seine-teal">✨</span>
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href={s.ctaHref}
            className="mt-6 inline-flex rounded-full bg-seine-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-teal/90"
          >
            {s.ctaButtonText}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {s.images.map((img, i) => (
            <div
              key={img.label + i}
              className="group relative h-32 overflow-hidden rounded-xl border border-seine-teal/20 shadow-sm sm:h-40"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" />
              <span className="absolute bottom-2 left-2.5 text-xs font-semibold text-white drop-shadow">
                {img.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
