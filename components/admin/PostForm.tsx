"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "./ImageUploadField";
import IndexingToggle from "./IndexingToggle";
import type { Post, ContentBlock, ContentBlockType } from "@/lib/posts";
import type { Tour } from "@/lib/data";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const hintClass = "mt-1 text-xs text-stone-500";

function emptyBlock(type: ContentBlockType): ContentBlock {
  return type === "list" ? { type, items: [""] } : { type, text: "" };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="font-semibold text-stone-900">{title}</p>
      {description && <p className="mt-0.5 text-xs text-stone-500">{description}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </div>
  );
}

function blockPreview(block: ContentBlock) {
  const text =
    block.type === "list" ? (block.items || []).join(", ") : block.text || "";
  const trimmed = text.length > 40 ? `${text.slice(0, 40)}…` : text;
  return trimmed || "(empty)";
}

export default function PostForm({
  initial,
  isNew,
  tours,
}: {
  initial: Post;
  isNew: boolean;
  tours: Tour[];
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  function updateTitle(value: string) {
    update("title", value);
    if (isNew && !slugTouched) {
      update("slug", slugify(value));
    }
  }

  function updateBlock(i: number, block: ContentBlock) {
    const next = [...post.content];
    next[i] = block;
    update("content", next);
  }

  function addBlock(type: ContentBlockType) {
    update("content", [...post.content, emptyBlock(type)]);
  }

  function removeBlock(i: number) {
    update(
      "content",
      post.content.filter((_, idx) => idx !== i)
    );
  }

  function moveBlock(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= post.content.length) return;
    const next = [...post.content];
    [next[i], next[j]] = [next[j], next[i]];
    update("content", next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${initial.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <SectionCard title="Basics" description="What readers see as the title, and where the page lives.">
        <div>
          <label className={labelClass}>Title (H1 on the page)</label>
          <input
            required
            value={post.title}
            onChange={(e) => updateTitle(e.target.value)}
            className={inputClass}
            placeholder="e.g. Best Time for a Seine River Cruise"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>URL slug</label>
            <input
              required
              disabled={!isNew}
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", e.target.value);
              }}
              className={`${inputClass} ${!isNew ? "bg-stone-100 text-stone-500" : ""}`}
              placeholder="best-time-for-a-seine-river-cruise"
            />
            <p className={hintClass}>
              {isNew
                ? "Auto-fills from the title. Page will live at /blog/" + (post.slug || "…")
                : "Locked after publishing so links don't break."}
            </p>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              required
              value={post.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
              placeholder="e.g. Trip Planning"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Publish date</label>
            <input
              type="date"
              required
              value={post.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Read time</label>
            <input
              required
              value={post.readTime}
              onChange={(e) => update("readTime", e.target.value)}
              className={inputClass}
              placeholder="e.g. 4 min read"
            />
          </div>
        </div>

        <ImageUploadField label="Hero image" value={post.image} onChange={(url) => update("image", url)} />
        <div>
          <label className={labelClass}>Image alt text</label>
          <input
            required
            value={post.imageAlt}
            onChange={(e) => update("imageAlt", e.target.value)}
            className={inputClass}
            placeholder="Describe the photo for screen readers and Google Images"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Search & Preview"
        description="How this post shows up on Google and in the blog listing."
      >
        <div>
          <label className={labelClass}>SEO meta title</label>
          <input
            required
            value={post.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>Shown as the blue link text in Google search results.</p>
        </div>
        <div>
          <label className={labelClass}>SEO meta description</label>
          <textarea
            required
            rows={2}
            value={post.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>The gray snippet under the title in Google search results.</p>
        </div>
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            required
            rows={2}
            value={post.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>Shown on the blog listing page's article card.</p>
        </div>
        <div>
          <label className={labelClass}>Quick Answer callout</label>
          <textarea
            required
            rows={2}
            value={post.quickAnswer}
            onChange={(e) => update("quickAnswer", e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>The highlighted "TL;DR" box right under the title.</p>
        </div>
      </SectionCard>

      <SectionCard title="Article Content" description="The body of the post, section by section.">
        <div className="flex flex-wrap gap-2">
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

        <div className="space-y-3">
          {post.content.map((block, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-500 ring-1 ring-stone-200">
                  {i + 1} · {block.type}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="text-stone-500 hover:text-stone-900 disabled:opacity-30">
                    ↑ Up
                  </button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === post.content.length - 1} className="text-stone-500 hover:text-stone-900 disabled:opacity-30">
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
                  onChange={(e) =>
                    updateBlock(i, { type: "list", items: e.target.value.split("\n") })
                  }
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
          {post.content.length === 0 && (
            <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              No content yet — add a heading or paragraph above to get started.
            </p>
          )}
        </div>

        <div className="grid gap-5 border-t border-stone-200 pt-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Recommended tour (cross-sell widget)</label>
            <select
              value={post.recommendedTourId}
              onChange={(e) => update("recommendedTourId", e.target.value)}
              className={inputClass}
            >
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Show it after which section?</label>
            <select
              value={post.recommendedTourAfterBlock ?? 0}
              onChange={(e) => update("recommendedTourAfterBlock", Number(e.target.value) || undefined)}
              className={inputClass}
            >
              <option value={0}>Don't show it</option>
              {post.content.map((block, i) => (
                <option key={i} value={i + 1}>
                  After #{i + 1} ({block.type}: {blockPreview(block)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      <IndexingToggle checked={post.noIndex} onChange={(next) => update("noIndex", next)} />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Publish Post" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
