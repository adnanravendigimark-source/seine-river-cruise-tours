import RecommendedTour from "./RecommendedTour";
import type { ContentBlock } from "@/lib/posts";

// Renders a post's content blocks (edited from /admin/posts) with the same
// prose styling the hand-written articles used, and drops the inline
// "Recommended Tour" widget after whichever block the post specifies.
export default function BlogPostBody({
  blocks,
  recommendedTourId,
  recommendedTourAfterBlock,
}: {
  blocks: ContentBlock[];
  recommendedTourId: string;
  recommendedTourAfterBlock?: number;
}) {
  return (
    <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-stone-900/80">
      {blocks.map((block, i) => (
        <div key={i}>
          {block.type === "heading" && (
            <h2 className="font-display text-xl font-semibold text-stone-900">{block.text}</h2>
          )}
          {block.type === "paragraph" && <p>{block.text}</p>}
          {block.type === "list" && (
            <ul className="list-disc space-y-2 pl-5">
              {(block.items || []).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
          {recommendedTourAfterBlock === i + 1 && (
            <div className="mt-5">
              <RecommendedTour tourId={recommendedTourId} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
