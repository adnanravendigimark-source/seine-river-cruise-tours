"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "./ImageUploadField";
import RichTextEditor from "./RichTextEditor";
import { useToast } from "./Toast";
import type { TourRecord, TourType } from "@/lib/data";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";

export default function TourForm({
  initial,
  isNew,
}: {
  initial: TourRecord;
  isNew: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [tour, setTour] = useState<TourRecord>(initial);
  const [includesText, setIncludesText] = useState(initial.includes.join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  // Unsaved-change protection: warn before closing the tab or navigating
  // away with the browser's own back/forward/reload while there's an edit
  // that was never saved — matches PostForm's guard for the same reason.
  useEffect(() => {
    if (!dirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update<K extends keyof TourRecord>(key: K, value: TourRecord[K]) {
    setTour((t) => ({ ...t, [key]: value }));
    setDirty(true);
  }

  function handleIncludesChange(value: string) {
    setIncludesText(value);
    setDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: TourRecord = {
      ...tour,
      includes: includesText.split("\n").map((s) => s.trim()).filter(Boolean),
      rating: Number(tour.rating),
      reviews: Number(tour.reviews),
      price: Number(tour.price),
      originalPrice: tour.originalPrice ? Number(tour.originalPrice) : undefined,
    };

    const url = isNew ? "/api/admin/tours" : `/api/admin/tours/${initial.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      const msg = data.error || "Save failed.";
      setError(msg);
      showToast("error", msg);
      return;
    }
    setDirty(false);
    showToast("success", isNew ? "Tour created." : "Tour saved.");
    router.push("/admin/tours");
    router.refresh();
  }

  function handleCancel() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    router.push("/admin/tours");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>ID (URL-safe, unique)</label>
          <input
            required
            disabled={!isNew}
            value={tour.id}
            onChange={(e) => update("id", e.target.value)}
            className={`${inputClass} ${!isNew ? "bg-stone-100 text-stone-500" : ""}`}
            placeholder="e.g. seine-sunset-cruise"
          />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={tour.badge}
            onChange={(e) => update("badge", e.target.value as TourType)}
            className={inputClass}
          >
            <option value="guided">Guided / hosted</option>
            <option value="self-guided">Self-guided (audio commentary)</option>
            <option value="combo">Combo</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input required value={tour.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <RichTextEditor
          value={tour.description}
          onChange={(html) => update("description", html)}
          minHeight="4rem"
          allowedHeadings={[]}
        />
        <p className="mt-1 text-xs text-stone-500">
          Shown on the tour card (clamped to 2 lines) — keep it short.
        </p>
      </div>

      <div>
        <label className={labelClass}>Includes (one per line)</label>
        <textarea
          rows={4}
          value={includesText}
          onChange={(e) => handleIncludesChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Ribbon badge (optional)</label>
          <input
            value={tour.ribbon || ""}
            onChange={(e) => update("ribbon", e.target.value)}
            className={inputClass}
            placeholder="e.g. Bestseller"
          />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input
            value={tour.duration || ""}
            onChange={(e) => update("duration", e.target.value)}
            className={inputClass}
            placeholder="e.g. 1 hour"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            required
            value={tour.rating}
            onChange={(e) => update("rating", Number(e.target.value) as unknown as number)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Review count</label>
          <input
            type="number"
            min="0"
            required
            value={tour.reviews}
            onChange={(e) => update("reviews", Number(e.target.value) as unknown as number)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Price (€)</label>
          <input
            type="number"
            min="0"
            required
            value={tour.price}
            onChange={(e) => update("price", Number(e.target.value) as unknown as number)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Was-price (optional)</label>
          <input
            type="number"
            min="0"
            value={tour.originalPrice ?? ""}
            onChange={(e) =>
              update(
                "originalPrice",
                (e.target.value ? Number(e.target.value) : undefined) as unknown as number
              )
            }
            className={inputClass}
          />
        </div>
      </div>

      <ImageUploadField label="Image" value={tour.image} onChange={(url) => update("image", url)} aspectRatio={4 / 3} />

      <div>
        <label className={labelClass}>Image alt text</label>
        <input
          required
          value={tour.imageAlt}
          onChange={(e) => update("imageAlt", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>GetYourGuide link (path or full URL)</label>
          <input
            required
            value={tour.hrefPath}
            onChange={(e) => update("hrefPath", e.target.value)}
            className={inputClass}
            placeholder="paris-l16/tour-name-t12345 — or paste a full https:// URL"
          />
        </div>
        <div>
          <label className={labelClass}>Link extra params (optional)</label>
          <input
            value={tour.hrefExtra || ""}
            onChange={(e) => update("hrefExtra", e.target.value)}
            className={inputClass}
            placeholder="&placement=content-top"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Best for</label>
        <input
          required
          value={tour.bestFor}
          onChange={(e) => update("bestFor", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Price table: "Duration" column (optional)</label>
        <input
          value={tour.priceTableColumn1 || ""}
          onChange={(e) => update("priceTableColumn1", e.target.value)}
          className={inputClass}
          placeholder="e.g. 1.5 hours"
        />
        <p className="mt-1 text-xs text-stone-500">
          Shown in the homepage price-comparison table's "Duration" column for this tour. Leave blank to
          use the Duration field above.
        </p>
      </div>

      <div>
        <label className={labelClass}>Price table: "Meal Included" column (optional)</label>
        <input
          value={tour.priceTableFeature || ""}
          onChange={(e) => update("priceTableFeature", e.target.value)}
          className={inputClass}
          placeholder="e.g. Yes — lunch or crêpe tasting"
        />
        <p className="mt-1 text-xs text-stone-500">
          Shown in the homepage price-comparison table's "Meal Included" column for this tour. Leave blank to show "No".
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={!!tour.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Featured (shown in homepage rich-result data)
      </label>

      <div className="flex gap-3 border-t border-stone-200 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Create Tour" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
