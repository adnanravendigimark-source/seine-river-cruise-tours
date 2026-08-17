import { getTours } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";

// Built directly from the tours sold above — every row is a real,
// bookable product with its own "Book" link, so this table works as a
// second conversion surface rather than just reference info. Heading/
// subheading/note are editable from /admin/homepage → Content tab (see
// lib/homepage.ts's PriceSection / DEFAULT_SECTIONS.price).
export default async function PriceComparison() {
  const [tours, { sections }] = await Promise.all([getTours(), getHomepageContent()]);
  const s = sections.price;
  return (
    <section id="prices" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-bold text-stone-900">{s.heading}</h2>
      <p
        className="rich-content mt-3 max-w-2xl text-stone-900/70"
        dangerouslySetInnerHTML={{ __html: s.subheading }}
      />

      <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-900/10">
        <table className="w-full min-w-[680px] border-collapse bg-white text-left text-sm">
          <thead>
            <tr className="bg-stone-900 text-white">
              <th className="px-5 py-4 font-semibold">{s.itemLabel}</th>
              <th className="px-5 py-4 font-semibold">{s.priceLabel}</th>
              <th className="px-5 py-4 font-semibold">{s.column1Label}</th>
              <th className="px-5 py-4 font-semibold">{s.column2Label}</th>
              <th className="px-5 py-4 font-semibold">{s.bestForLabel}</th>
              <th className="px-5 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, i) => (
              <tr
                key={tour.id}
                className={`border-t border-stone-900/10 ${
                  tour.ribbon === "Bestseller" ? "bg-seine-teal/5" : i % 2 ? "bg-stone-50" : ""
                }`}
              >
                <td className="px-5 py-4 font-medium text-stone-900">{tour.title}</td>
                <td className="px-5 py-4 font-semibold text-seine-amber">
                  €{tour.price} <span className="font-normal text-stone-900/40">/ person</span>
                </td>
                <td className="px-5 py-4 text-stone-900/70">{tour.priceTableColumn1 || tour.duration}</td>
                <td className="px-5 py-4 text-stone-900/70">{tour.priceTableFeature || "No"}</td>
                <td className="px-5 py-4 text-stone-900/70">{tour.bestFor}</td>
                <td className="px-5 py-4 text-right">
                  <a
                    href={tour.href}
                    target="_blank"
                    rel="noopener nofollow sponsored"
                    className="inline-flex rounded-full bg-seine-amber px-4 py-2 text-xs font-semibold text-white transition hover:bg-seine-amber/90"
                  >
                    {s.bookLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-900/50">{s.note}</p>
    </section>
  );
}
