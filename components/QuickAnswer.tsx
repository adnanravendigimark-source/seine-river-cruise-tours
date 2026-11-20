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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-seine-amber" aria-hidden="true">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-seine-amber">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-stone-900 [&_strong]:text-stone-900">{children}</p>
      </div>
    </div>
  );
}
