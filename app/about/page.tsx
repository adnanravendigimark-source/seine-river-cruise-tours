import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheckIcon, StarIcon, LockIcon, HeadsetIcon } from "@/components/icons";
import { getPageIndexingSettings } from "@/lib/settings";
import { resolveRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLE = "About Us | Seine River Cruise Tour & Ticket Booking Guide";
const DESCRIPTION =
  "Who curates our Seine River sightseeing and dinner cruises online, how we pick licensed operators, and why a good cruise beats a rushed one.";

// Static title/description/OG/keywords kept exactly as before — only
// `robots` is resolved dynamically now, per the admin-editable toggle at
// /admin/pages, so this had to move from a static `metadata` export to
// `generateMetadata`.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPageIndexingSettings();
  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      "About Seine river cruise tickets",
      "Seine river cruise guide",
      "book Seine river cruise online",
      "licensed Seine cruise operators",
      "Seine river cruise tickets online",
    ],
    alternates: { canonical: "/about" },
    robots: resolveRobots(settings.aboutNoIndex),
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: "/about",
      images: [
        {
          url: "https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=2000&auto=format&fit=crop",
          alt: "Eiffel Tower and the Seine River with sightseeing boats in Paris",
        },
      ],
    },
  };
}

const whyUs = [
  {
    icon: ShieldCheckIcon,
    title: "Licensed, Established Operators",
    body: "Every cruise we list runs with a licensed Paris operator — not a reseller adding a markup on top.",
  },
  {
    icon: StarIcon,
    title: "Real Review Volume",
    body: "We only list cruises with verifiable review counts and ratings, not cherry-picked testimonials.",
  },
  {
    icon: LockIcon,
    title: "Transparent Pricing",
    body: "The price you see on the tour card is the price you pay — no hidden fees added at checkout.",
  },
  {
    icon: HeadsetIcon,
    title: "Honest, Clear Info",
    body: "We tell you exactly what's included — and what isn't, like dinner, which is only on the dinner cruise.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero banner */}
        <section className="relative overflow-hidden bg-seine-ink text-white">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1554144573-91d40c39092a?q=80&w=2000&auto=format&fit=crop"
              alt="Eiffel Tower and the Seine River with sightseeing boats in Paris"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-seine-ink via-seine-ink/75 to-seine-ink/40" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              About Us
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
              Your Independent Guide to Seine River Cruise Tickets
            </h1>
            <p className="mt-5 text-white/85">
              We help travelers book the right Seine River sightseeing or dinner cruise online —
              curated from licensed Paris operators, explained in plain language.
            </p>
          </div>
        </section>

        {/* What we do — text + image */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Why We Built a Seine River Cruise Guide
            </h2>
            <p className="mt-4 text-stone-900/70">
              We built this site around one belief: a Seine River cruise is one of the best,
              cheapest things you can do in Paris — but only if you book the right one. Some
              operators oversell tiny boats, some "dinner cruises" cut every corner on the food, and
              prices for the exact same route can vary by 30% depending on where you book.
            </p>
            <p className="mt-4 text-stone-900/70">
              We're an independent Seine river cruise guide — not an official operator's website. We
              compare sightseeing cruises, dinner cruises, and evening illuminations cruises from
              licensed, established Paris operators, currently via GetYourGuide, and point you to
              the ones worth your time and money.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=1000&auto=format&fit=crop"
              alt="A river cruise boat gliding past illuminated buildings on the Seine at night"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Why us — icon cards */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-stone-900">
              How We Pick Our Seine River Cruises
            </h2>
            <p className="mt-3 max-w-2xl text-stone-900/70">
              Every cruise listed on this site is screened against four criteria before it earns a
              spot.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyUs.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-stone-900/10 bg-stone-50 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-seine-teal/10 text-seine-teal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-stone-900">{title}</p>
                  <p className="mt-1.5 text-sm text-stone-900/60">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclosure + CTA */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-stone-900">A Note on How We Earn</h2>
          <p className="mt-3 text-sm text-stone-900/70">
            When you book a Seine River cruise through a link on this site, we earn a small
            commission from the operator at no extra cost to you. This is how we keep the site free
            and independently written — it doesn't affect which cruises we recommend or how we rank
            them.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-seine-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-stone-900">
              Ready to book your Seine River cruise?
            </p>
            <a
              href="/#tours"
              className="shrink-0 rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
            >
              Compare Seine River Cruises →
            </a>
          </div>

          <p className="mt-8 text-sm text-stone-900/70">
            Questions before you book? Reach out via our{" "}
            <a href="/contact" className="font-medium text-seine-amber underline">
              contact page
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
