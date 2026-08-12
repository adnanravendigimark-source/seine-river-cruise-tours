import TourForm from "@/components/admin/TourForm";
import type { TourRecord } from "@/lib/data";

const blank: TourRecord = {
  id: "",
  badge: "self-guided",
  ribbon: "",
  title: "",
  description: "",
  includes: [],
  duration: "",
  rating: 5,
  reviews: 0,
  price: 0,
  originalPrice: undefined,
  image: "",
  imageAlt: "",
  hrefPath: "",
  hrefExtra: "",
  featured: false,
  bestFor: "",
};

export default function NewTourPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">Add Tour</h1>
      <div className="mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6">
        <TourForm initial={blank} isNew />
      </div>
    </div>
  );
}
