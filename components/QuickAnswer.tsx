// TL;DR-style callout right under the H1 — helps skimmers convert faster
// and gives search engines a clean, quotable answer for featured snippets.
// The id is the jump target for the "Quick Answer" entry TableOfContents.tsx
// prepends to the "In This Guide" box.
export default function QuickAnswer({
  children,
  label = "Quick Answer",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div id="quick-answer" className="mt-6 flex scroll-mt-24 gap-3 rounded-2xl border border-gold-500/25 bg-gold-500/5 p-5">
      <span className="mt-0.5 text-lg text-gold-600">💡</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-stone-900/80">{children}</p>
      </div>
    </div>
  );
}
