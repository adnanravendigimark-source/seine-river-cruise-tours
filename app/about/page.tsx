import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAboutPage } from "@/lib/about";
import { getIconComponent } from "@/lib/iconMap";
import { resolveRobots, resolveCanonical, resolveOg } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Every field below (title, description, canonical, indexing, follow, OG)
// comes from the admin-editable About page content (lib/about.ts) —
// nothing here is hardcoded. See /admin/about.
export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  const og = resolveOg(
    { ogTitle: about.ogTitle, ogDescription: about.ogDescription, ogImage: about.ogImage },
    { title: about.metaTitle, description: about.metaDescription, image: about.heroImage }
  );
  return {
    title: about.metaTitle,
    description: about.metaDescription,
    alternates: { canonical: resolveCanonical("/about", about.canonicalUrl) },
    robots: resolveRobots(about.noIndex, about.noFollow),
    openGraph: {
      title: og.title,
      description: og.description,
      url: "/about",
      images: og.image ? [{ url: og.image, alt: about.heroImageAlt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <>
      <Header />
      <main>
        {/* Hero banner */}
        <section className="relative overflow-hidden bg-seine-ink text-white">
          <div className="absolute inset-0">
            <Image
              src={about.heroImage}
              alt={about.heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-seine-ink via-seine-ink/75 to-seine-ink/40" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              {about.heroEyebrow}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
              {about.heroHeading}
            </h1>
            <div
              className="rich-content rich-content-invert mt-5 text-white/85"
              dangerouslySetInnerHTML={{ __html: about.heroSubheading }}
            />
          </div>
        </section>

        {/* What we do — text + image */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">{about.introHeading}</h2>
            <div className="rich-content mt-4 text-stone-900/70" dangerouslySetInnerHTML={{ __html: about.introParagraph1 }} />
            <div className="rich-content mt-4 text-stone-900/70" dangerouslySetInnerHTML={{ __html: about.introParagraph2 }} />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={about.introImage}
              alt={about.introImageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Why us — icon cards */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-stone-900">{about.reasonsHeading}</h2>
            <div
              className="rich-content mt-3 max-w-2xl text-stone-900/70"
              dangerouslySetInnerHTML={{ __html: about.reasonsSubheading }}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {about.reasons.map(({ icon, title, body }) => {
                const Icon = getIconComponent(icon);
                return (
                  <div key={title} className="rounded-2xl border border-stone-900/10 bg-stone-50 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-seine-teal/10 text-seine-teal">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-stone-900">{title}</p>
                    <div
                      className="rich-content mt-1.5 text-sm text-stone-900/60"
                      dangerouslySetInnerHTML={{ __html: body }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Disclosure + CTA */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-stone-900">{about.disclosureHeading}</h2>
          <div
            className="rich-content mt-3 text-sm text-stone-900/70"
            dangerouslySetInnerHTML={{ __html: about.disclosureBody }}
          />

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-seine-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-stone-900">{about.ctaText}</p>
            <a
              href="/#tours"
              className="shrink-0 rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
            >
              {about.ctaButtonLabel} →
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
