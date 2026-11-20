import { getTours, hasPrice } from "@/lib/data";
import { getHomepageContent, affiliateNoteText } from "@/lib/homepage";

// Built directly from the tours sold above — every row is a real,
// bookable product with its own "Book" link, so this table works as a
// second conversion surface rather than just reference info. Heading/
// subheading/note are editable from /admin/homepage → Content tab (see
// lib/homepage.ts's PriceSection / DEFAULT_SECTIONS.price).
export default async function PriceComparison({ embedded = false }: { embedded?: boolean } = {}) {
  const [tours, { sections, header }] = await Promise.all([getTours(), getHomepageContent()]);
  const s = sections.price;
  return (
    <section id="prices" className={`mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6 ${embedded ? "pb-16 pt-10" : "py-16"}`}>
      {embedded ? (
        <h3 className="font-display text-2xl font-bold text-stone-900">{s.heading}</h3>
      ) : (
        <h2 className="font-display text-3xl font-bold text-stone-900">{s.heading}</h2>
      )}
      <p
        className="rich-content mt-3 max-w-2xl text-stone-900/70"
        dangerouslySetInnerHTML={{ __html: s.subheading }}
      />

      <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-900/10">
        <table className="w-full min-w-[820px] border-collapse bg-white text-left text-sm">
          <thead>
            <tr className="bg-stone-900 text-white">
              <th className="px-5 py-4 font-semibold">{s.itemLabel}</th>
              <th className="px-5 py-4 font-semibold">{s.priceLabel}</th>
              <th className="px-5 py-4 font-semibold">{s.column1Label}</th>
              <th className="px-5 py-4 font-semibold">{s.column2Label}</th>
              <th className="px-5 py-4 font-semibold">Cancellation</th>
              <th className="px-5 py-4 font-semibold">{s.bestForLabel}</th>
              <th className="px-5 py-4 font-semibold"><span className="sr-only">{s.bookLabel}</span></th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, i) => (
              <tr
                key={tour.id}
                className={`border-t border-stone-900/10 ${
                  i === 0 ? "bg-seine-amber/5" : i % 2 ? "bg-stone-50" : ""
                }`}
              >
                <th scope="row" className="px-5 py-4 font-medium text-stone-900">{tour.title}</th>
                <td className="px-5 py-4 font-semibold text-seine-amber">
                  {hasPrice(tour) ? (
                    <>
                      €{tour.price} <span className="font-normal text-stone-900/65">/ person</span>
                    </>
                  ) : (
                    <span className="font-normal text-stone-900/70">See prices</span>
                  )}
                </td>
                <td className="px-5 py-4 text-stone-900/70">{tour.priceTableColumn1 || tour.duration}</td>
                <td className="px-5 py-4 text-stone-900/70">{tour.priceTableFeature || "No"}</td>
                <td className="px-5 py-4 text-stone-900/70">{tour.cancellation || "See booking page"}</td>
                <td className="px-5 py-4 text-stone-900/70">{tour.bestFor}</td>
                <td className="px-5 py-4 text-right">
                  <a
                    href={tour.href}
                    target="_blank"
                    rel="noopener nofollow sponsored"
                data-placement="price_table"
                    className="inline-flex min-h-[36px] items-center rounded-full bg-seine-amber px-4 text-xs font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber"
                  >
                    {s.bookLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-900/65">{s.note}</p>
      <p className="mt-1 text-xs text-stone-900/65">{affiliateNoteText(header)}</p>
    </section>
  );
}
