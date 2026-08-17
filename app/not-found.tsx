import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHomepageContent } from "@/lib/homepage";

// Custom 404 — a lost visitor is still a visitor. Instead of Next's bare
// default error page (a dead end that just loses the click), this keeps
// the header/footer nav and points them straight back at booking or the
// blog, since organic search traffic sometimes lands on stale/broken URLs.
// Copy editable from /admin/homepage → Content tab (see lib/homepage.ts's
// NotFoundSection / DEFAULT_SECTIONS.notFound).
export default async function NotFound() {
  const { sections } = await getHomepageContent();
  const s = sections.notFound;

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="font-display text-7xl font-bold text-seine-amber">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-stone-900 sm:text-3xl">
          {s.heading}
        </h1>
        <p className="mt-3 max-w-md text-stone-900/60">{s.body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={s.primaryButtonHref}
            className="rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            {s.primaryButtonText}
          </Link>
          <Link
            href={s.secondaryButtonHref}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            {s.secondaryButtonText}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
