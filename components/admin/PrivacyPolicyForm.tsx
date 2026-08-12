"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IndexingToggle from "./IndexingToggle";
import type { ContentBlock, ContentBlockType } from "@/lib/posts";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";

function emptyBlock(type: ContentBlockType): ContentBlock {
  return type === "list" ? { type, items: [""] } : { type, text: "" };
}

export default function PrivacyPolicyForm({
  initialTitle,
  initialContent,
  lastUpdated,
  initialNoIndex,
}: {
  initialTitle: string;
  initialContent: ContentBlock[];
  lastUpdated: string;
  initialNoIndex: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<ContentBlock[]>(initialContent);
  const [noIndex, setNoIndex] = useState(initialNoIndex);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateBlock(i: number, block: ContentBlock) {
    const next = [...content];
    next[i] = block;
    setContent(next);
    setSaved(false);
  }

  function addBlock(type: ContentBlockType) {
    setContent([...content, emptyBlock(type)]);
    setSaved(false);
  }

  function removeBlock(i: number) {
    setContent(content.filter((_, idx) => idx !== i));
    setSaved(false);
  }

  function moveBlock(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= content.length) return;
    const next = [...content];
    [next[i], next[j]] = [next[j], next[i]];
    setContent(next);
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/privacy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, noIndex }),
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
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Saved — live at /privacy-policy now. The "last updated" date was set to today automatically.
        </p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <label className="mb-1 block text-sm font-medium text-stone-700">Page title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
        <p className="mt-2 text-xs text-stone-500">Last updated: {lastUpdated || "—"} (updates automatically when you save)</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <p className="font-semibold text-stone-900">Policy content</p>
        <p className="mt-0.5 text-xs text-stone-500">
          Same section-by-section editor as blog posts — add a heading for each section, paragraphs for
          body text, and bullet lists where useful.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => addBlock("heading")} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
            + Heading
          </button>
          <button type="button" onClick={() => addBlock("paragraph")} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
            + Paragraph
          </button>
          <button type="button" onClick={() => addBlock("list")} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
            + Bullet list
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {content.map((block, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-500 ring-1 ring-stone-200">
                  {i + 1} · {block.type}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="text-stone-500 hover:text-stone-900 disabled:opacity-30">
                    ↑ Up
                  </button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === content.length - 1} className="text-stone-500 hover:text-stone-900 disabled:opacity-30">
                    ↓ Down
                  </button>
                  <button type="button" onClick={() => removeBlock(i)} className="text-red-600 hover:text-red-700">
                    Remove
                  </button>
                </div>
              </div>

              {block.type === "list" ? (
                <textarea
                  rows={3}
                  value={(block.items || []).join("\n")}
                  onChange={(e) => updateBlock(i, { type: "list", items: e.target.value.split("\n") })}
                  placeholder="One list item per line"
                  className={inputClass}
                />
              ) : (
                <textarea
                  rows={block.type === "heading" ? 1 : 4}
                  value={block.text || ""}
                  onChange={(e) => updateBlock(i, { type: block.type, text: e.target.value })}
                  placeholder={block.type === "heading" ? "Section heading" : "Paragraph text"}
                  className={inputClass}
                />
              )}
            </div>
          ))}
          {content.length === 0 && (
            <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              No content yet — add a heading or paragraph above to get started.
            </p>
          )}
        </div>
      </div>

      <IndexingToggle checked={noIndex} onChange={(next) => { setNoIndex(next); setSaved(false); }} />

      <div className="flex gap-3">
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
