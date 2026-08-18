import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { getSiteChrome } from "@/lib/homepage";

// Navbar — logo, nav links, and the CTA button are all CMS-editable from
// /admin/homepage → Content tab (see lib/homepage.ts's HeaderContent).
// Runs on every page (not just the homepage), so it fetches its own data
// rather than relying on props from a page-specific parent.
export default async function Header() {
  const { header } = await getSiteChrome();
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo src={header.logoImage} alt={header.logoAlt} line1={header.logoLine1} line2={header.logoLine2} />
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
          {header.navLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href} className="transition-colors hover:text-emerald-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={header.ctaHref}
            className="hidden rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30 md:inline-flex"
          >
            {header.ctaText}
          </Link>
          <MobileNav navLinks={header.navLinks} ctaText={header.ctaText} ctaHref={header.ctaHref} />
        </div>
      </div>
    </header>
  );
}
