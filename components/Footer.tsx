import Link from "next/link";
import Logo from "./Logo";
import { getSiteChrome } from "@/lib/homepage";

// Footer — tagline, link columns, address, and copyright are all
// CMS-editable from /admin/homepage → Content tab (see lib/homepage.ts's
// FooterContent). Runs on every page, so it fetches its own data.
export default async function Footer() {
  const { header, footer } = await getSiteChrome();
  return (
    <footer className="bg-stone-900 py-14 text-white/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Logo
              variant="compact"
              theme="dark"
              src={header.logoImage}
              alt={header.logoAlt}
              line1={header.logoLine1}
              line2={header.logoLine2}
            />
            <p
              className="mt-4 text-sm text-white/60 [&_strong]:text-white [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: footer.tagline }}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-white">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="font-semibold text-white">{footer.addressHeading}</p>
              <p className="mt-3 whitespace-pre-line text-white/50">
                {footer.addressLine1}
                {footer.addressLine2 ? `\n${footer.addressLine2}` : ""}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/40">
          © {new Date().getFullYear()} {footer.copyrightText}
        </p>
      </div>
    </footer>
  );
}
