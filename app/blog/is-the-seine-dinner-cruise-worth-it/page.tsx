import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickAnswer from "@/components/QuickAnswer";
import TableOfContents from "@/components/TableOfContents";
import BlogPostBody from "@/components/BlogPostBody";
import BlogSidebar from "@/components/BlogSidebar";
import SafeImage from "@/components/SafeImage";
import { getPost } from "@/lib/posts";
import { getHomepageContent } from "@/lib/homepage";
import { resolveRobots, resolveCanonical, resolveOg, buildArticleJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { extractTableOfContents } from "@/lib/tableOfContents";

const slug = "is-the-seine-dinner-cruise-worth-it";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost(slug);
  if (!post) return {};
  const og = resolveOg(
    { ogTitle: post.ogTitle, ogDescription: post.ogDescription, ogImage: post.ogImage },
    { title: post.metaTitle, description: post.metaDescription, image: post.image }
  );
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [
      "is the Seine dinner cruise worth it",
      "Seine dinner cruise review",
      "Bateaux Parisiens dinner cruise",
      "Paris dinner cruise worth it",
    ],
    alternates: { canonical: resolveCanonical(`/blog/${slug}`, post.canonicalUrl) },
    robots: resolveRobots(post.noIndex, post.noFollow),
    openGraph: {
      title: og.title,
      description: og.description,
      url: `/blog/${slug}`,
      type: "article",
      images: og.image ? [{ url: og.image, alt: post.imageAlt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function Post() {
  const [post, { sections }] = await Promise.all([getPost(slug), getHomepageContent()]);
  const s = sections.blogPage;
  if (!post) notFound();

  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${slug}`,
    authorName: "Seine River Cruise Tours",
    siteName: "Seine River Cruise Tours",
  });

  // Auto-built from the article's own H2/H3 headings — see
  // lib/tableOfContents.ts. "Quick Answer" is prepended by hand since it's
  // its own component/field rather than a heading inside `content`.
  const { toc: headingToc, html: contentHtml } = extractTableOfContents(post.content);
  const toc = post.quickAnswer.trim()
    ? [{ id: "quick-answer", text: s.quickAnswerLabel, level: 2 as const }, ...headingToc]
    : headingToc;

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.category, path: `/blog/${slug}` }]} />
      <main>
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
          <Link href="/blog" className="text-sm font-medium text-seine-teal">{s.backToGuidesText}</Link>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-seine-teal">
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-stone-900/20" />
            <span className="text-stone-900/40">{post.readTime}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-3 max-w-3xl text-lg text-stone-600">{post.excerpt}</p>}
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

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-10">
          <div>
            <TableOfContents items={toc} label={s.tocLabel} />

            <QuickAnswer label={s.quickAnswerLabel}>{post.quickAnswer}</QuickAnswer>

            <BlogPostBody
              content={contentHtml}
              recommendedTourId={post.recommendedTourId}
              showRecommendedTour={!!post.recommendedTourAfterBlock}
            />

            <div className="mt-10 rounded-2xl border border-seine-teal/20 bg-seine-teal/5 p-6">
              <p className="text-sm font-semibold text-stone-900">Want the dinner cruise?</p>
              <p className="mt-1 text-sm text-stone-900/70">
                Compare early and late seatings, and see what each menu includes.
              </p>
              <Link
                href="/#tours"
                className="mt-4 inline-flex rounded-full bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
              >
                See the Dinner Cruise
              </Link>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:border-l lg:border-stone-200 lg:pl-10">
            <BlogSidebar slug={post.slug} recommendedTourId={post.recommendedTourId} />
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </>
  );
}
