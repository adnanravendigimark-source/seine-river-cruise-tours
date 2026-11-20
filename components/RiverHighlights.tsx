import { getHomepageContent } from "@/lib/homepage";

// Content editable from /admin/homepage → Content tab (see
// lib/homepage.ts's HighlightsSection / DEFAULT_SECTIONS.highlights).
export default async function RiverHighlights() {
  const { sections } = await getHomepageContent();
  const s = sections.highlights;

  return (
    <section className="bg-seine-ink py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
          {s.eyebrow}
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold">{s.heading}</h2>
        <p className="mt-3 max-w-2xl text-white/70">{s.subheading}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.cards.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-seine-amber/40 hover:bg-white/10"
            >
              <HighlightIcon index={i} />
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Line icons replace the emoji the admin data used to carry (emoji render
// inconsistently across platforms and read as filler). Chosen by position:
// waterfront, island, meal, evening light.
function HighlightIcon({ index }: { index: number }) {
  const paths = [
    "M3 20h18M5 20V9l7-5 7 5v11M9 20v-5h6v5",
    "M4 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 1.5M12 3v9M8 7h8",
    "M5 3v8a3 3 0 0 0 6 0V3M8 3v18M16 3c-1.5 2-2 4-2 7h4c0-3-.5-5-2-7zm0 7v11",
    "M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold-400" aria-hidden="true">
      <path d={paths[index % paths.length]} />
    </svg>
  );
}
