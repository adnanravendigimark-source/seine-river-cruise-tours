import { getHomepageContent } from "@/lib/homepage";
import { getTours } from "@/lib/data";
import RecommendedTourForm from "@/components/admin/RecommendedTourForm";

export const dynamic = "force-dynamic";

export default async function AdminRecommendedTourPage() {
  const content = await getHomepageContent();
  const tours = await getTours();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">Recommended Tour</h1>
      <p className="mt-1 text-sm text-stone-600">
        Pick which cruise gets the gold "Recommended" spotlight — first in the homepage grid on
        desktop, pinned to a sticky bar on mobile.
      </p>
      <div className="mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6">
        <RecommendedTourForm initial={content} tours={tours} />
      </div>
    </div>
  );
}
