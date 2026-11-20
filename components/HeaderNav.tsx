"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/homepage";

// Desktop nav links with an underline on the current page. Colours flip with
// the header's solid/transparent state (see StickyHeader).
export default function HeaderNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname() || "/";
  return (
    <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href + link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-sm py-1 text-sm font-medium transition-colors duration-150 after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 ${
              active
                ? "font-semibold text-gold-400 after:bg-gold-400 group-data-[solid=true]:text-seine-amber group-data-[solid=true]:after:bg-seine-amber"
                : "text-white/85 hover:text-white group-data-[solid=true]:text-stone-900/75 group-data-[solid=true]:hover:text-seine-amber"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
