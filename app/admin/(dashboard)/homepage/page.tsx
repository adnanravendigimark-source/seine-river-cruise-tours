import { getHomepageContent } from "@/lib/homepage";
import HomepageForm from "@/components/admin/HomepageForm";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">Homepage Content</h1>
      <p className="mt-1 text-sm text-stone-600">Edits appear on the live homepage immediately after saving.</p>
      <div className="mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6">
        <HomepageForm initial={content} />
      </div>
    </div>
  );
}
