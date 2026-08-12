import Link from "next/link";
import { getToursRaw } from "@/lib/data";
import { getPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";
import { getSession } from "@/lib/session";
import type { PageKey } from "@/lib/pageAccess";
import { HomeIcon, StarBadgeIcon, TicketStackIcon, DocumentIcon, QuestionIcon, ShieldIcon, GlobeIcon, InfoIcon, MailIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const cards: { href: string; label: string; desc: string; icon: typeof HomeIcon; pageKey: PageKey }[] = [
  { href: "/admin/homepage", label: "Homepage Content", desc: "Hero headline, subheading, photo, and SEO.", icon: HomeIcon, pageKey: "homepage" },
  { href: "/admin/recommended", label: "Recommended Tour", desc: "Which cruise gets the gold spotlight + sticky mobile bar.", icon: StarBadgeIcon, pageKey: "homepage" },
  { href: "/admin/tours", label: "Tours & Tickets", desc: "The bookable cruises shown on the homepage.", icon: TicketStackIcon, pageKey: "tours" },
  { href: "/admin/posts", label: "Blog Posts", desc: "Articles shown on /blog, including full SEO per post.", icon: DocumentIcon, pageKey: "posts" },
  { href: "/admin/faqs", label: "FAQs", desc: "Homepage FAQ accordion.", icon: QuestionIcon, pageKey: "faqs" },
  { href: "/admin/privacy", label: "Privacy Policy", desc: "Legal page shown at /privacy-policy, linked from the footer.", icon: ShieldIcon, pageKey: "privacy" },
  { href: "/admin/about", label: "About Page", desc: "Every section of /about, plus its SEO.", icon: InfoIcon, pageKey: "about" },
  { href: "/admin/contact", label: "Contact Page", desc: "Every section of /contact, plus its SEO.", icon: MailIcon, pageKey: "contact" },
  { href: "/admin/pages", label: "Blog Page SEO", desc: "SEO fields for the /blog listing page.", icon: GlobeIcon, pageKey: "pages" },
];

export default async function AdminDashboardPage() {
  const tours = await getToursRaw();
  const posts = await getPosts();
  const content = await getHomepageContent();
  const featuredTour = tours.find((t) => t.id === content.featuredTourId);

  const session = await getSession();
  const isAdmin = session?.role === "admin";
  const pages = session?.pages || [];
  const visibleCards = cards.filter((c) => isAdmin || pages.includes(c.pageKey));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">Welcome back 👋</h1>
      <p className="mt-1 text-sm text-stone-600">
        Edit the live site's content below — changes save straight to the site, no developer needed.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-3xl font-bold text-stone-900">{tours.length}</p>
          <p className="text-sm text-stone-500">Cruises &amp; tickets live</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-3xl font-bold text-stone-900">{posts.length}</p>
          <p className="text-sm text-stone-500">Blog posts published</p>
        </div>
        <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-gold-600">
            <StarBadgeIcon className="h-4 w-4" /> Recommended
          </p>
          <p className="mt-1 truncate text-sm text-stone-900">
            {content.showFeaturedTour && featuredTour ? featuredTour.title : "Off"}
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-stone-400">Manage content</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-seine-amber/40 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition group-hover:bg-seine-amber/10 group-hover:text-seine-amber">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-stone-900">{card.label}</span>
                <span className="mt-0.5 block text-sm text-stone-500">{card.desc}</span>
              </span>
            </Link>
          );
        })}
        {visibleCards.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 sm:col-span-2">
            You don't have access to any sections yet — ask an admin to grant you page access from
            Users.
          </p>
        )}
      </div>
    </div>
  );
}
