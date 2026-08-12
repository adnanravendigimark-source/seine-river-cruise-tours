import Link from "next/link";
import { getToursRaw } from "@/lib/data";
import { getSession } from "@/lib/session";
import DeleteButton from "@/components/admin/DeleteButton";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const tours = await getToursRaw();
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Tours & Tickets</h1>
          <p className="mt-1 text-sm text-stone-600">The bookable cruises shown on the homepage.</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="rounded-lg bg-seine-amber px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
        >
          + Add Tour
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
              <SafeImage src={tour.image} alt={tour.imageAlt} fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-stone-900">{tour.title}</p>
              <p className="text-sm text-stone-500">
                €{tour.price} · {tour.ribbon || tour.badge} · id: {tour.id}
              </p>
            </div>
            <Link
              href={`/admin/tours/${tour.id}`}
              className="shrink-0 text-sm font-medium text-seine-teal hover:underline"
            >
              Edit
            </Link>
            {isAdmin && (
              <DeleteButton
                url={`/api/admin/tours/${tour.id}`}
                confirmMessage={`Delete "${tour.title}"? This can't be undone.`}
              />
            )}
          </div>
        ))}
        {tours.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
            No tours yet — add your first one.
          </p>
        )}
      </div>
    </div>
  );
}
