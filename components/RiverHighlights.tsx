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
          {s.cards.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-seine-amber/40 hover:bg-white/10"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
