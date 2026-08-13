import RecommendedTour from "./RecommendedTour";

// Renders a post's article body — a single continuous HTML string from the
// admin's rich text editor (headings, bold/italic, links, lists, tables,
// and inline images with captions all live together in one field, edited
// on one page) — and optionally drops the "Recommended Tour" widget right
// after it, before the closing CTA box. Safe to render via
// dangerouslySetInnerHTML because only authenticated admins can ever write
// to it, same trust boundary as the JSON-LD scripts already rendered
// elsewhere on the page.
export default function BlogPostBody({
  content,
  recommendedTourId,
  showRecommendedTour,
}: {
  content: string;
  recommendedTourId: string;
  showRecommendedTour?: boolean;
}) {
  return (
    <div className="mt-8 text-[17px] leading-relaxed text-stone-900/80">
      <div className="rich-content max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      {showRecommendedTour && (
        <div className="mt-5">
          <RecommendedTour tourId={recommendedTourId} />
        </div>
      )}
    </div>
  );
}
