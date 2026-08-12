"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IndexingToggle from "./IndexingToggle";
import type { PageIndexingSettings } from "@/lib/settings";

export default function PageIndexingSettingsForm({ initial }: { initial: PageIndexingSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<PageIndexingSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PageIndexingSettings>(key: K, value: PageIndexingSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
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
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>}

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">About page</p>
        <IndexingToggle checked={settings.aboutNoIndex} onChange={(next) => update("aboutNoIndex", next)} />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">Contact page</p>
        <IndexingToggle checked={settings.contactNoIndex} onChange={(next) => update("contactNoIndex", next)} />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-900">Blog listing page</p>
        <IndexingToggle checked={settings.blogNoIndex} onChange={(next) => update("blogNoIndex", next)} />
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
