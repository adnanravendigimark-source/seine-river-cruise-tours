"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "./ImageUploadField";
import IconPicker from "./IconPicker";
import SeoFieldsCard from "./SeoFieldsCard";
import RichTextEditor from "./RichTextEditor";
import type { AboutPageContent, AboutReason } from "@/lib/about";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";

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

export default function AboutForm({ initial }: { initial: AboutPageContent }) {
  const router = useRouter();
  const [about, setAbout] = useState<AboutPageContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof AboutPageContent>(key: K, value: AboutPageContent[K]) {
    setAbout((a) => ({ ...a, [key]: value }));
    setSaved(false);
  }

  function updateReason(i: number, patch: Partial<AboutReason>) {
    const next = [...about.reasons];
    next[i] = { ...next[i], ...patch };
    update("reasons", next);
  }

  function addReason() {
    update("reasons", [...about.reasons, { icon: "ShieldCheckIcon", title: "", body: "" }]);
  }

  function removeReason(i: number) {
    update("reasons", about.reasons.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
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
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved — live at /about now.</p>}

      <SectionCard title="Hero banner" description="The top banner readers see first.">
        <div>
          <label className={labelClass}>Eyebrow label</label>
          <input value={about.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} className={inputClass} placeholder="About Us" />
        </div>
        <div>
          <label className={labelClass}>Heading (H1)</label>
          <textarea rows={2} value={about.heroHeading} onChange={(e) => update("heroHeading", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subheading</label>
          <RichTextEditor value={about.heroSubheading} onChange={(html) => update("heroSubheading", html)} minHeight="4rem" allowedHeadings={[]} />
        </div>
        <ImageUploadField label="Hero background photo" value={about.heroImage} onChange={(url) => update("heroImage", url)} aspectRatio={16 / 9} />
        <div>
          <label className={labelClass}>Hero photo alt text</label>
          <input value={about.heroImageAlt} onChange={(e) => update("heroImageAlt", e.target.value)} className={inputClass} />
        </div>
      </SectionCard>

      <SectionCard title="Why we built this" description="The text + photo section under the hero.">
        <div>
          <label className={labelClass}>Heading (H2)</label>
          <input value={about.introHeading} onChange={(e) => update("introHeading", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>First paragraph</label>
          <RichTextEditor value={about.introParagraph1} onChange={(html) => update("introParagraph1", html)} minHeight="6rem" allowedHeadings={[]} />
        </div>
        <div>
          <label className={labelClass}>Second paragraph</label>
          <RichTextEditor value={about.introParagraph2} onChange={(html) => update("introParagraph2", html)} minHeight="6rem" allowedHeadings={[]} />
        </div>
        <ImageUploadField label="Section photo" value={about.introImage} onChange={(url) => update("introImage", url)} aspectRatio={4 / 3} />
        <div>
          <label className={labelClass}>Section photo alt text</label>
          <input value={about.introImageAlt} onChange={(e) => update("introImageAlt", e.target.value)} className={inputClass} />
        </div>
      </SectionCard>

      <SectionCard title="Trust reasons" description="The 4 icon cards explaining how tours are picked.">
        <div>
          <label className={labelClass}>Heading (H2)</label>
          <input value={about.reasonsHeading} onChange={(e) => update("reasonsHeading", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subheading</label>
          <RichTextEditor value={about.reasonsSubheading} onChange={(html) => update("reasonsSubheading", html)} minHeight="3rem" allowedHeadings={[]} />
        </div>
        <div className="space-y-3">
          {about.reasons.map((reason, i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Card {i + 1}</span>
                <button type="button" onClick={() => removeReason(i)} className="text-xs text-red-600 hover:text-red-700">
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <IconPicker value={reason.icon} onChange={(icon) => updateReason(i, { icon })} />
                <input
                  value={reason.title}
                  onChange={(e) => updateReason(i, { title: e.target.value })}
                  className={inputClass}
                  placeholder="Card title"
                />
                <RichTextEditor
                  value={reason.body}
                  onChange={(html) => updateReason(i, { body: html })}
                  minHeight="3rem"
                  allowedHeadings={[]}
                  placeholder="Card body text"
                />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addReason} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50">
          + Add card
        </button>
      </SectionCard>

      <SectionCard title="Affiliate disclosure & CTA" description="The closing section explaining how the site earns money.">
        <div>
          <label className={labelClass}>Heading</label>
          <input value={about.disclosureHeading} onChange={(e) => update("disclosureHeading", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Body text</label>
          <RichTextEditor value={about.disclosureBody} onChange={(html) => update("disclosureBody", html)} minHeight="6rem" allowedHeadings={[]} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>CTA prompt text</label>
            <input value={about.ctaText} onChange={(e) => update("ctaText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CTA button label</label>
            <input value={about.ctaButtonLabel} onChange={(e) => update("ctaButtonLabel", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Contact prompt (below the CTA box)</label>
          <RichTextEditor value={about.contactPromptHtml} onChange={(html) => update("contactPromptHtml", html)} minHeight="3rem" allowedHeadings={[]} />
        </div>
      </SectionCard>

      <SeoFieldsCard
        showMeta
        pathHint="/about"
        value={{
          metaTitle: about.metaTitle,
          metaDescription: about.metaDescription,
          canonicalUrl: about.canonicalUrl,
          noIndex: about.noIndex,
          noFollow: about.noFollow,
          ogTitle: about.ogTitle,
          ogDescription: about.ogDescription,
          ogImage: about.ogImage,
        }}
        onChange={(patch) => {
          setAbout((a) => ({ ...a, ...patch }));
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
