import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MailIcon, HeadsetIcon, BriefcaseIcon } from "@/components/icons";
import { getPageIndexingSettings } from "@/lib/settings";
import { resolveRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLE = "Contact Us | Seine River Cruise Tours";
const DESCRIPTION =
  "Questions about booking a Seine River sightseeing cruise, dinner cruise, or tickets online? Reach out directly — including for partnership and affiliate inquiries.";

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
      "contact Seine river cruise tours",
      "Seine river cruise booking help",
      "Seine river cruise affiliate partnership",
      "Seine river cruise questions",
    ],
    alternates: { canonical: "/contact" },
    robots: resolveRobots(settings.contactNoIndex),
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/contact" },
  };
}

const EMAIL = "livetravelpartner@gmail.com";

const reasons = [
  {
    icon: HeadsetIcon,
    title: "Booking Help",
    body: "Not sure whether to book the sightseeing cruise, dinner cruise, or evening illuminations cruise? Ask before you book.",
  },
  {
    icon: BriefcaseIcon,
    title: "Partnerships & Affiliates",
    body: "Cruise operators, DMCs, and affiliate partners — reach out about listing or collaboration opportunities.",
  },
  {
    icon: MailIcon,
    title: "General Questions",
    body: "Site feedback, content corrections, or anything else about Seine River cruises.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-seine-teal">
            Contact
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-3 max-w-md text-stone-900/60">
            Questions about a Seine River cruise or ticket — or a partnership inquiry? Reach out
            directly by email.
          </p>
        </div>

        {/* Primary email card */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-stone-900/10 bg-white p-8 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-seine-teal/10 text-seine-teal">
            <MailIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm text-stone-900/60">Email us directly</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-1 block break-all font-display text-lg font-semibold text-seine-amber"
            >
              {EMAIL}
            </a>
          </div>
          <p className="text-xs text-stone-900/50">We typically reply within 1–2 business days.</p>
        </div>

        {/* What we can help with */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900/5 text-stone-900/70 sm:mx-0">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-stone-900">{title}</p>
              <p className="mt-1 text-sm text-stone-900/60">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-stone-900/10 pt-8 text-center text-sm text-stone-900/60">
          Already have a booking? Contact the cruise operator directly via your confirmation email —
          they handle changes and refunds faster than we can.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-seine-teal/5 p-8 text-center">
          <p className="font-medium text-stone-900">Not booked yet?</p>
          <a
            href="/#tours"
            className="rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            Compare Seine River Cruises &amp; Tickets →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
