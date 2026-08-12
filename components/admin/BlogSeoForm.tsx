"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SeoFieldsCard from "./SeoFieldsCard";
import type { BlogSeoSettings } from "@/lib/settings";

export default function BlogSeoForm({ initial }: { initial: BlogSeoSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<BlogSeoSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Save failed. Please try again.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved — live at /blog now.</p>}

      <SeoFieldsCard
        showMeta
        pathHint="/blog"
        value={settings}
        onChange={(patch) => {
          setSettings((s) => ({ ...s, ...patch }));
          setSaved(false);
        }}
      />

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
