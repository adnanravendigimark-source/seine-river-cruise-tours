import Link from "next/link";
import SafeImage from "./SafeImage";
import { getPosts } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";

// Wrapper copy (eyebrow/heading/subheading/button labels) editable from
// /admin/homepage → Content tab (see lib/homepage.ts's BlogTeaserSection /
// DEFAULT_SECTIONS.blogTeaser). The posts themselves come from /admin/posts.
export default async function BlogSection() {
  const [allPosts, { sections }] = await Promise.all([getPosts(), getHomepageContent()]);
  const posts = allPosts.filter((p) => !p.noIndex).slice(0, 3);
  const s = sections.blogTeaser;

  if (posts.length === 0) return null;

  return (
    <section className="bg-stone-100/70 py-16 sm:py-24 border-t border-stone-200/60" id="blog-guides">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-seine-teal">
              {s.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {s.heading}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-stone-600">{s.subheading}</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30"
          >
            <span>{s.viewAllText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-900/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <SafeImage
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold uppercase tracking-wide text-emerald-700">
                    {post.category}
                  </span>
                  {post.readTime && <span className="text-stone-900/40">{post.readTime}</span>}
                </div>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-stone-900 group-hover:text-amber-600">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600 leading-relaxed">{post.excerpt}</p>
                )}
                <div className="mt-auto pt-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition group-hover:text-amber-600 group-hover:gap-2"
                  >
                    <span>{s.readArticleText}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition hover:scale-[1.02]"
          >
            <span>{s.viewAllText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
