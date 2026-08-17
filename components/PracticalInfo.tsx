import { getHomepageContent } from "@/lib/homepage";

// Content editable from /admin/homepage → Content tab (see
// lib/homepage.ts's PracticalSection / DEFAULT_SECTIONS.practical).
export default async function PracticalInfo() {
  const { sections } = await getHomepageContent();
  const s = sections.practical;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">{s.hoursHeading}</h3>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {s.hours.map((row, i) => (
                <tr key={row.range + i} className="border-b border-stone-900/5">
                  <td className="py-2 text-stone-900/70">{row.range}</td>
                  <td className="py-2 text-right font-medium text-stone-900">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-stone-900/50">{s.hoursNote}</p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">{s.addressHeading}</h3>
          <p className="mt-4 whitespace-pre-line text-sm text-stone-900/70">{s.address}</p>
          <p className="mt-3 text-xs text-stone-900/50">{s.metro}</p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-stone-900">{s.bestTimeHeading}</h3>
          <p
            className="rich-content mt-4 text-sm text-stone-900/70"
            dangerouslySetInnerHTML={{ __html: s.bestTimeBody }}
          />
        </div>
      </div>
    </section>
  );
}
