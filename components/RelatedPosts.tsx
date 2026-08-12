import Link from "next/link";
import SafeImage from "./SafeImage";
import { getRelatedPosts } from "@/lib/posts";

export default async function RelatedPosts({ slug }: { slug: string }) {
  const related = await getRelatedPosts(slug);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-stone-900/10 pt-10">
      <p className="font-display text-lg font-semibold text-stone-900">Related Guides</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 rounded-2xl border border-stone-900/10 bg-white p-3 transition hover:shadow-md"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
              <SafeImage src={post.image} alt={post.imageAlt} fill sizes="100px" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-seine-teal">
                {post.category}
              </span>
              <p className="mt-0.5 text-sm font-semibold text-stone-900 group-hover:text-seine-amber">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
