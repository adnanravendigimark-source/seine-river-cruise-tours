import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { AdminSidebarNav, AdminMobileNav } from "@/components/admin/AdminNav";
import Image from "next/image";
import { ExternalLinkIcon } from "@/components/admin/icons";
import logoImg from "@/assets/Logo.png";

// Belt-and-suspenders alongside the X-Robots-Tag header middleware already
// sets on every /admin response — this covers the <meta name="robots">
// tag specifically, in case anything ever reads/renders this HTML outside
// that middleware's reach. Applies to every page under this layout.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isAdmin = session?.role === "admin";
  const pages = session?.pages || [];

  return (
    <div className="flex min-h-screen bg-stone-100 font-body text-stone-900">
      <aside className="hidden w-64 shrink-0 flex-col bg-stone-900 text-white sm:flex">
        {/* Sidebar is narrower than the public header, so this is a
            purpose-sized brand mark rather than the full <Logo /> — that
            component's wordmark needs more width than 256px leaves room
            for and was overflowing the column. */}
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
            <Image src={logoImg} alt="Seine River Cruise Tours logo" className="h-full w-full object-cover" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold italic text-white">
              Seine River Cruise
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">
              Content Admin
            </p>
          </div>
        </div>
        <AdminSidebarNav isAdmin={isAdmin} pages={pages} />
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLinkIcon className="h-3.5 w-3.5" /> View live site
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex-1">
        {/* Top admin bar */}
        <header className="flex items-center justify-between border-b border-stone-900/10 bg-white px-4 py-3.5 sm:px-8">
          <div className="sm:hidden">
            <p className="font-display text-base font-bold">Seine River Cruise</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-seine-amber">
              Content Admin
            </p>
          </div>
          <div className="hidden items-center gap-2 text-sm text-stone-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {session && (
              <>
                {session.email}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    isAdmin ? "bg-gold-500/15 text-gold-600" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {session.role}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 sm:flex"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" /> View Site
            </Link>
            <span className="hidden sm:block">
              <AdminLogoutButton compact />
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seine-ink text-xs font-bold text-white sm:hidden">
              {session?.email.slice(0, 1).toUpperCase() || "A"}
            </span>
          </div>
        </header>

        <AdminMobileNav isAdmin={isAdmin} pages={pages} />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
