import { getFaqs } from "@/lib/data";
import { getHomepageContent } from "@/lib/homepage";

export default async function FAQSection() {
  const [faqs, { sections }] = await Promise.all([getFaqs(), getHomepageContent()]);
  // FAQPage structured data — makes these eligible for rich results /
  // "People also ask" boxes. Add/edit questions from /admin/faqs. The
  // answer is admin-entered rich text (bold, links, lists) — structured
  // data needs plain text, so HTML tags are stripped for the JSON-LD copy
  // while the visible <p> below renders the real formatted markup.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-bold text-stone-900">
        {sections.faq.heading}
      </h2>
      <div className="mt-8 divide-y divide-stone-900/10 rounded-2xl border border-stone-900/10 bg-white">
        {faqs.map((f) => (
          <details key={f.question} className="group p-6 open:bg-stone-50/50">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-stone-900">
              {f.question}
              <span className="ml-4 text-stone-900/40 transition group-open:rotate-45">+</span>
            </summary>
            <div
              className="rich-content mt-3 text-sm leading-relaxed text-stone-900/70"
              dangerouslySetInnerHTML={{ __html: f.answer }}
            />
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
