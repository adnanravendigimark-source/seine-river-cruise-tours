import Link from "next/link";
import { getHomepageContent } from "@/lib/homepage";

// Four short "plan your visit" answers, each linking to the full guide
// (or an anchor on this page). Editable from /admin/homepage → Content
// (lib/homepage.ts → sections.plan).
const safeHref = (href: string) => {
  const h = href.trim();
  return h.startsWith("/") || h.startsWith("#") || /^https:\/\//i.test(h) ? h : "";
};

export default async function PlanYourVisit() {
  const { sections } = await getHomepageContent();
  const s = sections.plan;
  const cards = s.cards.filter((c) => c.title.trim());
  if (!s.heading.trim() || cards.length === 0) return null;

  return (
    <section id="plan" className="scroll-mt-20 border-t border-stone-900/10 bg-white pt-16 sm:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl">{s.heading}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const href = safeHref(card.href);
            return (
              <li key={card.title} className="flex flex-col rounded-3xl border border-stone-900/10 bg-stone-50 p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-stone-900">{card.title}</h3>
                <p className="mt-2 text-sm text-stone-900/75">{card.body}</p>
                {href && card.linkText && (
                  <Link
                    href={href}
                    className="mt-auto pt-4 text-sm font-semibold text-seine-amber underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seine-amber"
                  >
                    {card.linkText}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
