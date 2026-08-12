import { notFound } from "next/navigation";
import { getToursRaw } from "@/lib/data";
import TourForm from "@/components/admin/TourForm";

export const dynamic = "force-dynamic";

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const tours = await getToursRaw();
  const tour = tours.find((t) => t.id === params.id);
  if (!tour) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">Edit Tour</h1>
      <div className="mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6">
        <TourForm initial={tour} isNew={false} />
      </div>
    </div>
  );
}
