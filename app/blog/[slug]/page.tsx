import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickAnswer from "@/components/QuickAnswer";
import BlogPostBody from "@/components/BlogPostBody";
import BlogSidebar from "@/components/BlogSidebar";
import SafeImage from "@/components/SafeImage";
import { getPost } from "@/lib/posts";
import { getRedirectTarget } from "@/lib/redirects";
import { resolveRobots, resolveCanonical, resolveOg, buildArticleJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

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
  const og = resolveOg(
    { ogTitle: post.ogTitle, ogDescription: post.ogDescription, ogImage: post.ogImage },
    { title: post.metaTitle, description: post.metaDescription, image: post.image }
  );
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: resolveCanonical(`/blog/${params.slug}`, post.canonicalUrl) },
    robots: resolveRobots(post.noIndex, post.noFollow),
    openGraph: {
      title: og.title,
      description: og.description,
      url: `/blog/${params.slug}`,
      type: "article",
      images: og.image ? [{ url: og.image, alt: post.imageAlt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    // This slug isn't a live post — but it might be an old address for one
    // that's since been renamed from the admin. Redirecting instead of a
    // flat 404 keeps old links and search rankings working.
    const target = await getRedirectTarget(params.slug);
    if (target) permanentRedirect(`/blog/${target}`);
    notFound();
  }

  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    authorName: "Seine River Cruise Tours",
    siteName: "Seine River Cruise Tours",
  });

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <main>
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
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
              <p className="text-sm font-semibold text-stone-900">{post.ctaHeading}</p>
              <p className="mt-1 text-sm text-stone-900/70">{post.ctaBody}</p>
              <Link
                href={post.ctaButtonHref}
                className="mt-4 inline-flex rounded-full bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
              >
                {post.ctaButtonText}
              </Link>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <BlogSidebar slug={post.slug} recommendedTourId={post.recommendedTourId} />
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </>
  );
}
