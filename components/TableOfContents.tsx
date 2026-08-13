import type { TocItem } from "@/lib/tableOfContents";

// "In This Guide" jump-link box — sits right under the hero image, above
// the Quick Answer callout. Built fresh on every render from whatever H2/H3
// headings the article currently has (see lib/tableOfContents.ts), so it
// never drifts out of sync with the actual article structure. Only top-level
// (H2) sections are listed — H3 sub-points (e.g. numbered items under a "Why
// Choose a Guided Tour?" section) are left out so this stays a short list of
// section headings, not every sub-point. Hidden entirely for a short article
// with fewer than 2 sections — not worth a box for one link.
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const sections = items.filter((item) => item.level === 2);
  if (sections.length < 2) return null;

  return (
    <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-seine-amber">In This Guide</p>
      <ul className="mt-3 space-y-2 text-sm">
        {sections.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-center gap-1.5 text-stone-700 transition hover:text-seine-amber"
            >
              <span aria-hidden="true" className="text-seine-amber">
                ›
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
