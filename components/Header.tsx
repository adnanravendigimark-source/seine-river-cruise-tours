import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import HeaderNav from "./HeaderNav";
import StickyHeader from "./StickyHeader";
import { getSiteChrome } from "@/lib/homepage";

// Navbar — logo, nav links, and the CTA button are all CMS-editable from
// /admin/homepage → Content tab (see lib/homepage.ts's HeaderContent).
// `overlay` (homepage only): transparent over the hero, solid white on scroll.
export default async function Header({ overlay = false }: { overlay?: boolean }) {
  const { header } = await getSiteChrome();
  const logoProps = { src: header.logoImage, alt: header.logoAlt, line1: header.logoLine1, line2: header.logoLine2 };
  return (
    <StickyHeader overlay={overlay}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="contents group-data-[solid=true]:hidden">
          <Logo theme="dark" {...logoProps} />
        </span>
        <span className="hidden group-data-[solid=true]:contents">
          <Logo {...logoProps} />
        </span>
        <HeaderNav links={header.navLinks} />
        <div className="flex items-center gap-2">
          <Link
            href={header.ctaHref}
            className="hidden items-center gap-2 rounded-full bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-[filter,box-shadow] duration-150 hover:shadow-md hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 md:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true">
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M9 6v12M15 6v12" strokeDasharray="2 2" />
            </svg>
            {header.ctaText}
          </Link>
          <MobileNav navLinks={header.navLinks} ctaText={header.ctaText} ctaHref={header.ctaHref} />
        </div>
      </div>
    </StickyHeader>
  );
}
