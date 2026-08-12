import { getPageIndexingSettings } from "@/lib/settings";
import PageIndexingSettingsForm from "@/components/admin/PageIndexingSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const settings = await getPageIndexingSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">About / Contact / Blog SEO</h1>
      <p className="mt-1 text-sm text-stone-600">
        These 3 pages don't have their own content editor, so their "Search Engine Indexing" setting
        lives here instead. Every other page (Homepage, each Blog Post, Privacy Policy) has this same
        toggle right on its own edit screen.
      </p>
      <div className="mt-8 max-w-xl">
        <PageIndexingSettingsForm initial={settings} />
      </div>
    </div>
  );
}
