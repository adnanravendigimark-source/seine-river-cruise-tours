import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Custom 404 — a lost visitor is still a visitor. Instead of Next's bare
// default error page (a dead end that just loses the click), this keeps
// the header/footer nav and points them straight back at booking or the
// blog, since organic search traffic sometimes lands on stale/broken URLs.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="font-display text-7xl font-bold text-seine-amber">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-stone-900 sm:text-3xl">
          Looks like this page missed the boat.
        </h1>
        <p className="mt-3 max-w-md text-stone-900/60">
          The page you're looking for doesn't exist or may have moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#tours"
            className="rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            Compare River Cruises &amp; Tickets →
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Read the Travel Guide
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
