import { getHomepageContent } from "@/lib/homepage";

// Content editable from /admin/homepage → Content tab (see
// lib/homepage.ts's WhySection / DEFAULT_SECTIONS.why).
export default async function WhatYouSee() {
  const { sections } = await getHomepageContent();
  const s = sections.why;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-stone-900">{s.heading}</h2>
        <p
          className="rich-content mt-3 max-w-2xl text-stone-900/70"
          dangerouslySetInnerHTML={{ __html: s.intro }}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900">{s.timelineHeading}</h3>
            <ol className="mt-4 space-y-4 border-l border-stone-900/10 pl-5">
              {s.timeline.map((row, i) => (
                <li key={row.time + i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-seine-teal" />
                  <span className="text-xs font-semibold text-seine-teal">{row.time}</span>
                  <p className="text-sm text-stone-900/80">{row.step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900">{s.learnHeading}</h3>
            <ul className="mt-4 space-y-3">
              {s.learn.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-900/80">
                  <span className="text-gold-500">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-stone-900/50">{s.note}</p>
          </div>
        </div>

        {s.extraItems.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-lg font-semibold text-stone-900">{s.extraHeading}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {s.extraItems.map((point, i) => (
                <div key={point.name + i} className="rounded-xl border border-stone-900/10 bg-stone-50 p-4">
                  <p className="text-sm font-semibold text-seine-teal">{point.name}</p>
                  <p className="mt-1 text-xs text-stone-900/70">{point.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-seine-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-stone-900">{s.ctaText}</p>
          <a
            href={s.ctaHref}
            className="shrink-0 rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            {s.ctaButtonText}
          </a>
        </div>
      </div>
    </section>
  );
}
