import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickAnswer from "@/components/QuickAnswer";
import BlogPostBody from "@/components/BlogPostBody";
import BlogSidebar from "@/components/BlogSidebar";
import SafeImage from "@/components/SafeImage";
import { getPost } from "@/lib/posts";
import { resolveRobots } from "@/lib/seo";

// Fallback route for any post created from /admin/posts that doesn't have
// its own hand-built page file (the 3 original launch articles do, for
// slightly more custom keyword targeting in their metadata — new posts
// added later are served here automatically).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${params.slug}` },
    robots: resolveRobots(post.noIndex),
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${params.slug}`,
      type: "article",
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : undefined,
    },
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
          <Link href="/blog" className="text-sm font-medium text-seine-teal">← All guides</Link>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-seine-teal">
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-stone-900/20" />
            <span className="text-stone-900/40">{post.readTime}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            {post.title}
          </h1>
          <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl">
            <SafeImage
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-14">
          <div className="lg:col-span-2">
            <QuickAnswer>{post.quickAnswer}</QuickAnswer>

            <BlogPostBody
              blocks={post.content}
              recommendedTourId={post.recommendedTourId}
              recommendedTourAfterBlock={post.recommendedTourAfterBlock}
            />

            <div className="mt-10 rounded-2xl border border-seine-teal/20 bg-seine-teal/5 p-6">
              <p className="text-sm font-semibold text-stone-900">Ready to book?</p>
              <p className="mt-1 text-sm text-stone-900/70">
                Compare cruise prices and tickets on the homepage.
              </p>
              <Link
                href="/#prices"
                className="mt-4 inline-flex rounded-full bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
              >
                See Price Comparison
              </Link>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <BlogSidebar slug={post.slug} recommendedTourId={post.recommendedTourId} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
