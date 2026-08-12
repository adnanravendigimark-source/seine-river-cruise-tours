"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PageKey } from "@/lib/pageAccess";
import {
  GridIcon,
  HomeIcon,
  StarBadgeIcon,
  TicketStackIcon,
  DocumentIcon,
  QuestionIcon,
  ShieldIcon,
  GlobeIcon,
  InfoIcon,
  MailIcon,
  UsersIcon,
} from "./icons";

const baseNavItems: { href: string; label: string; icon: typeof GridIcon; pageKey?: PageKey }[] = [
  { href: "/admin", label: "Dashboard", icon: GridIcon },
  { href: "/admin/homepage", label: "Homepage", icon: HomeIcon, pageKey: "homepage" },
  { href: "/admin/recommended", label: "Recommended Tour", icon: StarBadgeIcon, pageKey: "homepage" },
  { href: "/admin/tours", label: "Tours & Tickets", icon: TicketStackIcon, pageKey: "tours" },
  { href: "/admin/posts", label: "Blog Posts", icon: DocumentIcon, pageKey: "posts" },
  { href: "/admin/faqs", label: "FAQs", icon: QuestionIcon, pageKey: "faqs" },
  { href: "/admin/privacy", label: "Privacy Policy", icon: ShieldIcon, pageKey: "privacy" },
  { href: "/admin/about", label: "About Page", icon: InfoIcon, pageKey: "about" },
  { href: "/admin/contact", label: "Contact Page", icon: MailIcon, pageKey: "contact" },
  { href: "/admin/pages", label: "Blog Page SEO", icon: GlobeIcon, pageKey: "pages" },
];

const usersNavItem = { href: "/admin/users", label: "Users", icon: UsersIcon };

function visibleNavItems(isAdmin: boolean, pages: PageKey[]) {
  const items = baseNavItems.filter((item) => !item.pageKey || isAdmin || pages.includes(item.pageKey));
  return isAdmin ? [...items, usersNavItem] : items;
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ isAdmin, pages }: { isAdmin: boolean; pages: PageKey[] }) {
  const pathname = usePathname();
  const navItems = visibleNavItems(isAdmin, pages);
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-6">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-gold-500/15 text-gold-400"
                : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-gold-400" : "text-white/40"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav({ isAdmin, pages }: { isAdmin: boolean; pages: PageKey[] }) {
  const pathname = usePathname();
  const navItems = visibleNavItems(isAdmin, pages);
  return (
    <nav className="flex gap-1.5 overflow-x-auto border-b border-stone-900/10 bg-white px-4 py-2 sm:hidden">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active ? "bg-seine-amber text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
