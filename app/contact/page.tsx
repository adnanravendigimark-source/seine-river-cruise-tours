import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MailIcon } from "@/components/icons";
import { getContactPage } from "@/lib/contact";
import { getIconComponent } from "@/lib/iconMap";
import { resolveRobots, resolveCanonical, resolveOg } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Every field below (title, description, canonical, indexing, follow, OG)
// comes from the admin-editable Contact page content (lib/contact.ts) —
// nothing here is hardcoded. See /admin/contact.
export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactPage();
  const og = resolveOg(
    { ogTitle: contact.ogTitle, ogDescription: contact.ogDescription, ogImage: contact.ogImage },
    { title: contact.metaTitle, description: contact.metaDescription }
  );
  return {
    title: contact.metaTitle,
    description: contact.metaDescription,
    alternates: { canonical: resolveCanonical("/contact", contact.canonicalUrl) },
    robots: resolveRobots(contact.noIndex, contact.noFollow),
    openGraph: { title: og.title, description: og.description, url: "/contact", images: og.image ? [{ url: og.image }] : undefined },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-seine-teal">
            {contact.heroEyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
            {contact.heroHeading}
          </h1>
          <div
            className="rich-content mx-auto mt-3 max-w-md text-stone-900/60"
            dangerouslySetInnerHTML={{ __html: contact.heroSubheading }}
          />
        </div>

        {/* Primary email card */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-stone-900/10 bg-white p-8 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-seine-teal/10 text-seine-teal">
            <MailIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm text-stone-900/60">Email us directly</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1 block break-all font-display text-lg font-semibold text-seine-amber"
            >
              {contact.email}
            </a>
          </div>
          <p className="text-xs text-stone-900/50">{contact.emailNote}</p>
        </div>

        {/* What we can help with */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {contact.reasons.map(({ icon, title, body }) => {
            const Icon = getIconComponent(icon);
            return (
              <div key={title} className="text-center sm:text-left">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900/5 text-stone-900/70 sm:mx-0">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-stone-900">{title}</p>
                <div
                  className="rich-content mt-1 text-sm text-stone-900/60"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            );
          })}
        </div>

        <div
          className="rich-content mt-12 border-t border-stone-900/10 pt-8 text-center text-sm text-stone-900/60"
          dangerouslySetInnerHTML={{ __html: contact.footerNote }}
        />

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-seine-teal/5 p-8 text-center">
          <p className="font-medium text-stone-900">{contact.ctaHeading}</p>
          <a
            href="/#tours"
            className="rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            {contact.ctaButtonLabel} →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
