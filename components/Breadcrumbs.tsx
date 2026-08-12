import Link from "next/link";
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";

// Visual breadcrumb trail + its matching BreadcrumbList structured data,
// rendered together so the two can never drift out of sync (one always
// reflects the other). `items` should NOT include "Home" — it's added
// automatically here as the first entry.
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  const jsonLd = buildBreadcrumbJsonLd(full);

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-5 text-xs text-stone-500 sm:px-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {full.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === full.length - 1 ? (
              <span aria-current="page" className="font-medium text-stone-700">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="hover:text-stone-800 hover:underline">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
