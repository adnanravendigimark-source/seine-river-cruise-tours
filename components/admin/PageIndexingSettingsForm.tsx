"use client";

import { useEffect, useState } from "react";
import IndexingToggle from "./IndexingToggle";
import type { PageIndexingSettings } from "@/lib/settings";

// Unlike Post/Homepage/Privacy Policy, this page has nothing else to
// batch a save with, so each toggle saves itself immediately on click
// (like a normal settings switch) instead of waiting for a separate
// "Save Changes" button — that extra step was easy to miss and made it
// look like the toggle "didn't work" when really the change just hadn't
// been saved yet.
export default function PageIndexingSettingsForm({ initial }: { initial: PageIndexingSettings }) {
  const [settings, setSettings] = useState<PageIndexingSettings>(initial);
  const [savingKey, setSavingKey] = useState<keyof PageIndexingSettings | null>(null);
  const [error, setError] = useState("");

  // `initial` comes from the server component's render, which Next.js's
  // client-side router cache can keep serving a stale copy of for up to
  // ~30s after navigating away and back (router.refresh() after a save
  // didn't fully close this — the cache is keyed by more than just this
  // page). Re-fetching directly from the API on every mount sidesteps
  // that cache entirely: this is a plain fetch to a Route Handler, not a
  // page navigation, so it's never served from the router cache and
  // always reflects what's actually in the database right now.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !cancelled) setSettings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle<K extends keyof PageIndexingSettings>(key: K, next: boolean) {
    const previous = settings;
    const updated = { ...settings, [key]: next };
    setSettings(updated);
    setSavingKey(key);
    setError("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json().catch(() => ({}));
    setSavingKey(null);

    if (!res.ok) {
      setSettings(previous); // revert the optimistic flip
      setError(data.error || "Save failed. Please try again.");
    }
  }

  return (
    <div className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">About page</p>
        <IndexingToggle
          checked={settings.aboutNoIndex}
          disabled={savingKey === "aboutNoIndex"}
          onChange={(next) => toggle("aboutNoIndex", next)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">Contact page</p>
        <IndexingToggle
          checked={settings.contactNoIndex}
          disabled={savingKey === "contactNoIndex"}
          onChange={(next) => toggle("contactNoIndex", next)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">Blog listing page</p>
        <IndexingToggle
          checked={settings.blogNoIndex}
          disabled={savingKey === "blogNoIndex"}
          onChange={(next) => toggle("blogNoIndex", next)}
        />
      </div>
    </div>
  );
}
