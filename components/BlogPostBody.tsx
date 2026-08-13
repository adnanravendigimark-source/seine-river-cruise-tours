import RecommendedTour from "./RecommendedTour";
import SafeImage from "./SafeImage";
import type { ContentBlock } from "@/lib/posts";

// Renders a post's content blocks (edited from /admin/posts) with the same
// prose styling the hand-written articles used, and drops the inline
// "Recommended Tour" widget after whichever block the post specifies.
// "paragraph" blocks store their own HTML from the admin's rich text
// editor (bold, italic, links, lists, tables, inline images) — safe to
// render via dangerouslySetInnerHTML because only authenticated admins can
// ever write to it, same trust boundary as the JSON-LD scripts already
// rendered elsewhere on the page.
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
          {block.type === "heading" &&
            (block.level === 3 ? (
              <h3 className="font-display text-lg font-semibold text-stone-900">{block.text}</h3>
            ) : (
              <h2 className="font-display text-xl font-semibold text-stone-900">{block.text}</h2>
            ))}

          {block.type === "paragraph" && (
            <div className="rich-content max-w-none" dangerouslySetInnerHTML={{ __html: block.text || "" }} />
          )}

          {block.type === "list" &&
            (block.ordered ? (
              <ol className="list-decimal space-y-2 pl-5">
                {(block.items || []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5">
                {(block.items || []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ))}

          {block.type === "image" && block.src && (
            <figure className="my-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <SafeImage src={block.src} alt={block.alt || ""} fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
              </div>
              {block.caption && <figcaption className="mt-2 text-center text-sm text-stone-500">{block.caption}</figcaption>}
            </figure>
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
