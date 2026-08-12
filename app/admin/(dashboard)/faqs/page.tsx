import { getFaqs } from "@/lib/data";
import FaqsForm from "@/components/admin/FaqsForm";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await getFaqs();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">FAQs</h1>
      <p className="mt-1 text-sm text-stone-600">Shown in the homepage FAQ accordion, in this order.</p>
      <div className="mt-8 max-w-2xl">
        <FaqsForm initial={faqs} />
      </div>
    </div>
  );
}
