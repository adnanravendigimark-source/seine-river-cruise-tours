import { getAboutPage } from "@/lib/about";
import AboutForm from "@/components/admin/AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAboutPage();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">About Page</h1>
      <p className="mt-1 text-sm text-stone-600">
        Edit the page title, then write the whole page body in one content area — just like a blog article —
        plus the SEO fields below.
      </p>
      <div className="mt-8 max-w-3xl">
        <AboutForm initial={about} />
      </div>
    </div>
  );
}
