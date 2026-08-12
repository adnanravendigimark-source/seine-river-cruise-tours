"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomepageContent } from "@/lib/homepage";
import type { Tour } from "@/lib/data";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";

// Edits the same underlying homepage record as the Homepage page, but only
// exposes the "recommended tour" fields — the rest of the content (hero
// copy, etc.) is carried through untouched on save.
export default function RecommendedTourForm({
  initial,
  tours,
}: {
  initial: HomepageContent;
  tours: Tour[];
}) {
  const router = useRouter();
  const [content, setContent] = useState<HomepageContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function updateReason(i: number, value: string) {
    const next = [...content.featuredReasons];
    next[i] = value;
    update("featuredReasons", next);
  }

  function addReason() {
    update("featuredReasons", [...content.featuredReasons, ""]);
  }

  function removeReason(i: number) {
    update(
      "featuredReasons",
      content.featuredReasons.filter((_, idx) => idx !== i)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Save failed. Please try again.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Saved — live on the tours grid (and mobile sticky bar) now.
        </p>
      )}

      <label className="flex items-center gap-2 text-sm font-semibold text-stone-900">
        <input
          type="checkbox"
          checked={content.showFeaturedTour}
          onChange={(e) => update("showFeaturedTour", e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Show the Recommended Tour widget
      </label>
      <p className="-mt-3 text-xs text-stone-500">
        When on: the chosen tour is pinned first in the homepage grid with a gold "Recommended"
        treatment, and shown in a sticky booking bar on mobile.
      </p>

      <div>
        <label className={labelClass}>Which tour to feature</label>
        <select
          value={content.featuredTourId}
          onChange={(e) => update("featuredTourId", e.target.value)}
          className={inputClass}
        >
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Badge label</label>
          <input
            value={content.featuredBadgeLabel}
            onChange={(e) => update("featuredBadgeLabel", e.target.value)}
            className={inputClass}
            placeholder="Recommended"
          />
        </div>
        <div>
          <label className={labelClass}>Urgency / offer text</label>
          <input
            value={content.featuredUrgencyText}
            onChange={(e) => update("featuredUrgencyText", e.target.value)}
            className={inputClass}
            placeholder="Best Price · Limited Availability"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>"Why we recommend this" bullets (first 2 shown on the card)</label>
        <div className="space-y-2">
          {content.featuredReasons.map((reason, i) => (
            <div key={i} className="flex gap-2">
              <input value={reason} onChange={(e) => updateReason(i, e.target.value)} className={inputClass} />
              <button
                type="button"
                onClick={() => removeReason(i)}
                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addReason}
          className="mt-2 rounded-lg border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
        >
          + Add reason
        </button>
      </div>

      <div className="border-t border-stone-200 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
