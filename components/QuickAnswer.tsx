// TL;DR-style callout right under the H1 — helps skimmers convert faster
// and gives search engines a clean, quotable answer for featured snippets.
export default function QuickAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex gap-3 rounded-2xl border border-gold-500/25 bg-gold-500/5 p-5">
      <span className="mt-0.5 text-lg text-gold-600">💡</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
          Quick Answer
        </p>
        <p className="mt-1 text-sm leading-relaxed text-stone-900/80">{children}</p>
      </div>
    </div>
  );
}
