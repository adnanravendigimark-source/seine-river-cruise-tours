import PostForm from "@/components/admin/PostForm";
import { getTours } from "@/lib/data";
import type { Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const tours = await getTours();

  const today = new Date().toISOString().slice(0, 10);
  const blank: Post = {
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    category: "",
    excerpt: "",
    quickAnswer: "",
    readTime: "",
    date: today,
    updatedAt: today,
    image: "",
    imageAlt: "",
    recommendedTourId: tours[0]?.id || "",
    recommendedTourAfterBlock: 0,
    content: "",
    ctaHeading: "Ready to book?",
    ctaBody: "Compare cruise prices and tickets on the homepage.",
    ctaButtonText: "See Price Comparison",
    ctaButtonHref: "/#prices",
    focusKeyword: "",
    noIndex: false,
    noFollow: false,
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">New Post</h1>
      <p className="mt-1 text-sm text-stone-600">Fill in the basics, then write the article section by section.</p>
      <div className="mt-8 max-w-7xl">
        <PostForm initial={blank} isNew tours={tours} />
      </div>
    </div>
  );
}
