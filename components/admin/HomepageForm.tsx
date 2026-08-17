"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploadField from "./ImageUploadField";
import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";
import SeoPreview from "./SeoPreview";
import CharCounter from "./CharCounter";
import ColorField from "./ColorField";
import type {
  HomepageContent,
  NavLink,
  FooterColumn,
  FooterLink,
  TimelineRow,
  HoursRow,
  GalleryImage,
  HighlightCard,
} from "@/lib/homepage";
import type { Tour } from "@/lib/data";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";
const hintClass = "mt-1 text-xs text-stone-500";

const TABS = [
  { key: "content", label: "Content", icon: "📝" },
  { key: "seo", label: "SEO", icon: "🔍" },
  { key: "social", label: "Social Media", icon: "📣" },
  { key: "images", label: "Images", icon: "🖼️" },
  { key: "advanced", label: "Advanced SEO", icon: "⚙️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// One entry per collapsible card on the Content tab — powers both the
// "Jump to section" quick nav and each card's default open/closed state.
const CONTENT_SECTIONS = [
  { id: "sec-navbar", label: "Navbar" },
  { id: "sec-hero", label: "Hero" },
  { id: "sec-highlights", label: "Highlights" },
  { id: "sec-tourgrid", label: "Tour Grid" },
  { id: "sec-why", label: "What You See" },
  { id: "sec-tower", label: "Illuminations Cruise" },
  { id: "sec-practical", label: "Practical Info" },
  { id: "sec-price", label: "Price Comparison" },
  { id: "sec-blogteaser", label: "Blog Teaser" },
  { id: "sec-faq", label: "FAQ" },
  { id: "sec-blogpages", label: "Blog Pages" },
  { id: "sec-404", label: "404 Page" },
  { id: "sec-footer", label: "Footer" },
] as const;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

// Collapsible when `id`+`onToggle` are supplied (the Content tab, which has
// enough sections to get overwhelming otherwise) — every other tab passes
// neither and just renders permanently open, exactly like before.
function SectionCard({
  id,
  title,
  description,
  children,
  tone = "default",
  open = true,
  onToggle,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "sitewide";
  open?: boolean;
  onToggle?: () => void;
}) {
  const collapsible = typeof onToggle === "function";
  const header = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        {description && <p className="mt-0.5 text-xs text-stone-500">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {tone === "sitewide" && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
            Site-wide
          </span>
        )}
        {collapsible && (
          <span className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
            ▾
          </span>
        )}
      </div>
    </div>
  );
  return (
    <div id={id} className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6">
      {collapsible ? (
        <button type="button" onClick={onToggle} className="block w-full text-left">
          {header}
        </button>
      ) : (
        header
      )}
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
}

export default function HomepageForm({ initial, tours }: { initial: HomepageContent; tours: Tour[] }) {
  const router = useRouter();
  const [content, setContent] = useState<HomepageContent>(initial);
  const [activeTab, setActiveTab] = useState<TabKey>("content");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  // Only the first section starts open — everything else is one click (or
  // one "Jump to section" tap) away, so the tab doesn't read as one long
  // wall of fields.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [CONTENT_SECTIONS[0].id]: true,
  });

  function toggleSection(id: string) {
    setOpenSections((s) => ({ ...s, [id]: !s[id] }));
  }

  function jumpToSection(id: string) {
    setOpenSections((s) => ({ ...s, [id]: true }));
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function update<K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function updateHeader(patch: Partial<HomepageContent["header"]>) {
    setContent((c) => ({ ...c, header: { ...c.header, ...patch } }));
    setSaved(false);
  }

  function updateFooter(patch: Partial<HomepageContent["footer"]>) {
    setContent((c) => ({ ...c, footer: { ...c.footer, ...patch } }));
    setSaved(false);
  }

  function updateTheme(patch: Partial<HomepageContent["theme"]>) {
    setContent((c) => ({ ...c, theme: { ...c.theme, ...patch } }));
    setSaved(false);
  }

  function updateTours(patch: Partial<HomepageContent["sections"]["tours"]>) {
    setContent((c) => ({ ...c, sections: { ...c.sections, tours: { ...c.sections.tours, ...patch } } }));
    setSaved(false);
  }

  function updateWhy(patch: Partial<HomepageContent["sections"]["why"]>) {
    setContent((c) => ({ ...c, sections: { ...c.sections, why: { ...c.sections.why, ...patch } } }));
    setSaved(false);
  }

  function updateTower(patch: Partial<HomepageContent["sections"]["tower"]>) {
    setContent((c) => ({ ...c, sections: { ...c.sections, tower: { ...c.sections.tower, ...patch } } }));
    setSaved(false);
  }

  function updatePractical(patch: Partial<HomepageContent["sections"]["practical"]>) {
    setContent((c) => ({
      ...c,
      sections: { ...c.sections, practical: { ...c.sections.practical, ...patch } },
    }));
    setSaved(false);
  }

  function updatePrice(patch: Partial<HomepageContent["sections"]["price"]>) {
    setContent((c) => ({ ...c, sections: { ...c.sections, price: { ...c.sections.price, ...patch } } }));
    setSaved(false);
  }

  function updateHighlights(patch: Partial<HomepageContent["sections"]["highlights"]>) {
    setContent((c) => ({
      ...c,
      sections: { ...c.sections, highlights: { ...c.sections.highlights, ...patch } },
    }));
    setSaved(false);
  }

  function updateFaq(patch: Partial<HomepageContent["sections"]["faq"]>) {
    setContent((c) => ({ ...c, sections: { ...c.sections, faq: { ...c.sections.faq, ...patch } } }));
    setSaved(false);
  }

  function updateNotFound(patch: Partial<HomepageContent["sections"]["notFound"]>) {
    setContent((c) => ({
      ...c,
      sections: { ...c.sections, notFound: { ...c.sections.notFound, ...patch } },
    }));
    setSaved(false);
  }

  function updateBlogTeaser(patch: Partial<HomepageContent["sections"]["blogTeaser"]>) {
    setContent((c) => ({
      ...c,
      sections: { ...c.sections, blogTeaser: { ...c.sections.blogTeaser, ...patch } },
    }));
    setSaved(false);
  }

  function updateBlogPage(patch: Partial<HomepageContent["sections"]["blogPage"]>) {
    setContent((c) => ({
      ...c,
      sections: { ...c.sections, blogPage: { ...c.sections.blogPage, ...patch } },
    }));
    setSaved(false);
  }

  const focusChecklist = useMemo(() => {
    const kw = content.focusKeyword.trim().toLowerCase();
    if (!kw) return null;
    const plainSubheading = content.heroSubheading.replace(/<[^>]+>/g, "");
    const inTitle = (content.metaTitle || content.heroHeading).toLowerCase().includes(kw);
    const inH1 = content.heroHeading.toLowerCase().includes(kw);
    const inDescription = (content.metaDescription || plainSubheading).toLowerCase().includes(kw);
    const inUrl = true; // homepage is always "/"
    return [
      { label: "Appears in the SEO title", pass: inTitle },
      { label: "Appears in the H1 headline", pass: inH1 },
      { label: "Appears in the meta description", pass: inDescription },
      { label: "Homepage URL ( / )", pass: inUrl },
    ];
  }, [content.focusKeyword, content.metaTitle, content.heroHeading, content.metaDescription, content.heroSubheading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
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
    <form onSubmit={handleSubmit} className="space-y-5 pb-24">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 rounded-2xl border border-stone-200 bg-white p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-seine-teal text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Saved — live on the site now, no rebuild or hard refresh needed.
        </p>
      )}

      {/* ---------------- CONTENT TAB ---------------- */}
      {activeTab === "content" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
              Jump to section
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToSection(s.id)}
                  className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <SectionCard
            id="sec-navbar"
            title="Navbar"
            description="The menu bar at the top of every page. The logo image lives on the Images tab."
            tone="sitewide"
            open={!!openSections["sec-navbar"]}
            onToggle={() => toggleSection("sec-navbar")}
          >
            <Field label="Nav links">
              <RepeatableList<NavLink>
                items={content.header.navLinks}
                onChange={(navLinks) => updateHeader({ navLinks })}
                newItem={() => ({ label: "New Link", href: "/" })}
                addLabel="+ Add nav link"
                renderItem={(link, upd) => (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={link.label} onChange={(e) => upd({ ...link, label: e.target.value })} placeholder="Label" className={inputClass} />
                    <input value={link.href} onChange={(e) => upd({ ...link, href: e.target.value })} placeholder="/about" className={inputClass} />
                  </div>
                )}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Button text">
                <input value={content.header.ctaText} onChange={(e) => updateHeader({ ctaText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Button link">
                <input value={content.header.ctaHref} onChange={(e) => updateHeader({ ctaHref: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Logo text — line 1">
                <input value={content.header.logoLine1} onChange={(e) => updateHeader({ logoLine1: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Logo text — line 2">
                <input value={content.header.logoLine2} onChange={(e) => updateHeader({ logoLine2: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={'Breadcrumb "Home" label'} hint="Shown as the first crumb on blog article pages.">
                <input value={content.header.homeLabel} onChange={(e) => updateHeader({ homeLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'Site-wide "Book Now" button text'} hint="Used on every tour card, the mobile sticky bar, and the blog sidebar.">
                <input value={content.header.bookNowText} onChange={(e) => updateHeader({ bookNowText: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-hero"
            title="Hero"
            description="The full-width banner at the top of the homepage."
            open={!!openSections["sec-hero"]}
            onToggle={() => toggleSection("sec-hero")}
          >
            <Field label="Hero badge (small pill above the headline)">
              <input value={content.heroBadge} onChange={(e) => update("heroBadge", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Hero headline (H1)">
              <textarea rows={2} value={content.heroHeading} onChange={(e) => update("heroHeading", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Hero subheading">
              <RichTextEditor value={content.heroSubheading} onChange={(html) => update("heroSubheading", html)} minHeight="4rem" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Rating value" hint="e.g. 4.8 / 5">
                <input value={content.ratingValue} onChange={(e) => update("ratingValue", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Rating count label" hint="e.g. 1,200+ reviews">
                <input value={content.ratingCount} onChange={(e) => update("ratingCount", e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Primary button text">
                <input value={content.heroCtaPrimaryText} onChange={(e) => update("heroCtaPrimaryText", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Primary button link">
                <input value={content.heroCtaPrimaryHref} onChange={(e) => update("heroCtaPrimaryHref", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Secondary button text">
                <input value={content.heroCtaSecondaryText} onChange={(e) => update("heroCtaSecondaryText", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Secondary button link">
                <input value={content.heroCtaSecondaryHref} onChange={(e) => update("heroCtaSecondaryHref", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-highlights"
            title="Seine River Highlights section"
            description="The dark trust/highlights band right below the hero."
            open={!!openSections["sec-highlights"]}
            onToggle={() => toggleSection("sec-highlights")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Eyebrow">
                <input value={content.sections.highlights.eyebrow} onChange={(e) => updateHighlights({ eyebrow: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Heading (H2)">
                <input value={content.sections.highlights.heading} onChange={(e) => updateHighlights({ heading: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Subheading">
              <textarea rows={2} value={content.sections.highlights.subheading} onChange={(e) => updateHighlights({ subheading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Highlight cards">
              <RepeatableList<HighlightCard>
                items={content.sections.highlights.cards}
                onChange={(cards) => updateHighlights({ cards })}
                newItem={() => ({ icon: "✨", title: "New Highlight", body: "" })}
                addLabel="+ Add card"
                renderItem={(card, upd) => (
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-[4rem_1fr]">
                      <input value={card.icon} onChange={(e) => upd({ ...card, icon: e.target.value })} placeholder="🗼" className={inputClass} />
                      <input value={card.title} onChange={(e) => upd({ ...card, title: e.target.value })} placeholder="Title" className={inputClass} />
                    </div>
                    <textarea rows={2} value={card.body} onChange={(e) => upd({ ...card, body: e.target.value })} placeholder="Card body text" className={inputClass} />
                  </div>
                )}
              />
            </Field>
          </SectionCard>

          <SectionCard
            id="sec-tourgrid"
            title="Tour Grid section"
            description="The heading + intro text directly above the tour cards."
            open={!!openSections["sec-tourgrid"]}
            onToggle={() => toggleSection("sec-tourgrid")}
          >
            <Field label="Section heading (H2)">
              <input value={content.sections.tours.heading} onChange={(e) => updateTours({ heading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Subheading">
              <textarea rows={2} value={content.sections.tours.subheading} onChange={(e) => updateTours({ subheading: e.target.value })} className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard
            id="sec-why"
            title="“What You See” section"
            description="The route timeline + what-you'll-notice section below the tour grid."
            open={!!openSections["sec-why"]}
            onToggle={() => toggleSection("sec-why")}
          >
            <Field label="Section heading (H2)">
              <input value={content.sections.why.heading} onChange={(e) => updateWhy({ heading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Intro text">
              <RichTextEditor value={content.sections.why.intro} onChange={(html) => updateWhy({ intro: html })} />
            </Field>
            <Field label="Timeline heading">
              <input value={content.sections.why.timelineHeading} onChange={(e) => updateWhy({ timelineHeading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Timeline steps">
              <RepeatableList<TimelineRow>
                items={content.sections.why.timeline}
                onChange={(timeline) => updateWhy({ timeline })}
                newItem={() => ({ time: "0:00", step: "" })}
                addLabel="+ Add timeline step"
                renderItem={(row, upd) => (
                  <div className="grid gap-2 sm:grid-cols-[6rem_1fr]">
                    <input value={row.time} onChange={(e) => upd({ ...row, time: e.target.value })} placeholder="0:00" className={inputClass} />
                    <input value={row.step} onChange={(e) => upd({ ...row, step: e.target.value })} placeholder="What happens at this point" className={inputClass} />
                  </div>
                )}
              />
            </Field>
            <Field label="“What you'll learn” heading">
              <input value={content.sections.why.learnHeading} onChange={(e) => updateWhy({ learnHeading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="“What you'll learn” bullet points">
              <RepeatableList<string>
                items={content.sections.why.learn}
                onChange={(learn) => updateWhy({ learn })}
                newItem={() => ""}
                addLabel="+ Add bullet"
                renderItem={(item, upd) => (
                  <input value={item} onChange={(e) => upd(e.target.value)} className={inputClass} />
                )}
              />
            </Field>
            <Field label="Small note under the bullets">
              <textarea rows={2} value={content.sections.why.note} onChange={(e) => updateWhy({ note: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Optional 3rd list heading" hint="Leave blank and empty to hide this block entirely — e.g. a “Where you can board” list for a cruise site.">
              <input value={content.sections.why.extraHeading} onChange={(e) => updateWhy({ extraHeading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Optional 3rd list items">
              <RepeatableList<{ name: string; note: string }>
                items={content.sections.why.extraItems}
                onChange={(extraItems) => updateWhy({ extraItems })}
                newItem={() => ({ name: "", note: "" })}
                addLabel="+ Add item"
                renderItem={(row, upd) => (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={row.name} onChange={(e) => upd({ ...row, name: e.target.value })} placeholder="Name" className={inputClass} />
                    <input value={row.note} onChange={(e) => upd({ ...row, note: e.target.value })} placeholder="Note" className={inputClass} />
                  </div>
                )}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="CTA banner text">
                <input value={content.sections.why.ctaText} onChange={(e) => updateWhy({ ctaText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="CTA button text">
                <input value={content.sections.why.ctaButtonText} onChange={(e) => updateWhy({ ctaButtonText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="CTA button link">
                <input value={content.sections.why.ctaHref} onChange={(e) => updateWhy({ ctaHref: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-tower"
            title="Illuminations Cruise section"
            description="Images live on the Images tab."
            open={!!openSections["sec-tower"]}
            onToggle={() => toggleSection("sec-tower")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Eyebrow label">
                <input value={content.sections.tower.eyebrow} onChange={(e) => updateTower({ eyebrow: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Heading (H2)">
                <input value={content.sections.tower.heading} onChange={(e) => updateTower({ heading: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Body text">
              <RichTextEditor value={content.sections.tower.body} onChange={(html) => updateTower({ body: html })} />
            </Field>
            <Field label="Bullet points">
              <RepeatableList<string>
                items={content.sections.tower.bullets}
                onChange={(bullets) => updateTower({ bullets })}
                newItem={() => ""}
                addLabel="+ Add bullet"
                renderItem={(item, upd) => (
                  <input value={item} onChange={(e) => upd(e.target.value)} className={inputClass} />
                )}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Button text">
                <input value={content.sections.tower.ctaButtonText} onChange={(e) => updateTower({ ctaButtonText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Button link">
                <input value={content.sections.tower.ctaHref} onChange={(e) => updateTower({ ctaHref: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-practical"
            title="Practical Info section"
            description="Opening hours, address, and best-time advice."
            open={!!openSections["sec-practical"]}
            onToggle={() => toggleSection("sec-practical")}
          >
            <Field label="Opening hours heading">
              <input value={content.sections.practical.hoursHeading} onChange={(e) => updatePractical({ hoursHeading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Opening hours">
              <RepeatableList<HoursRow>
                items={content.sections.practical.hours}
                onChange={(hours) => updatePractical({ hours })}
                newItem={() => ({ range: "", time: "" })}
                addLabel="+ Add row"
                renderItem={(row, upd) => (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={row.range} onChange={(e) => upd({ ...row, range: e.target.value })} placeholder="e.g. April – September" className={inputClass} />
                    <input value={row.time} onChange={(e) => upd({ ...row, time: e.target.value })} placeholder="e.g. 9:00 AM – 8:00 PM" className={inputClass} />
                  </div>
                )}
              />
            </Field>
            <Field label="Small note under the hours table">
              <input value={content.sections.practical.hoursNote} onChange={(e) => updatePractical({ hoursNote: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Address heading">
                <input value={content.sections.practical.addressHeading} onChange={(e) => updatePractical({ addressHeading: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Metro / transit line">
                <input value={content.sections.practical.metro} onChange={(e) => updatePractical({ metro: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Address">
              <textarea rows={2} value={content.sections.practical.address} onChange={(e) => updatePractical({ address: e.target.value })} className={inputClass} />
            </Field>
            <Field label="“Best time to visit” heading">
              <input value={content.sections.practical.bestTimeHeading} onChange={(e) => updatePractical({ bestTimeHeading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="“Best time to visit” text">
              <RichTextEditor value={content.sections.practical.bestTimeBody} onChange={(html) => updatePractical({ bestTimeBody: html })} minHeight="5rem" />
            </Field>
          </SectionCard>

          <SectionCard
            id="sec-price"
            title="Price comparison"
            description="The table rows pull live from Tours & Tickets — this covers the heading above it and the column headers on the table itself."
            open={!!openSections["sec-price"]}
            onToggle={() => toggleSection("sec-price")}
          >
            <Field label="Heading (H2)">
              <input value={content.sections.price.heading} onChange={(e) => updatePrice({ heading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Subheading">
              <RichTextEditor value={content.sections.price.subheading} onChange={(html) => updatePrice({ subheading: html })} minHeight="4rem" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Column: item name" hint='e.g. "Cruise Type"'>
                <input value={content.sections.price.itemLabel} onChange={(e) => updatePrice({ itemLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Column: price" hint='e.g. "Price"'>
                <input value={content.sections.price.priceLabel} onChange={(e) => updatePrice({ priceLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Column 1" hint={'e.g. "Duration" — set per tour via its "Price table: Duration" field, or leave blank to use the tour\'s own Duration field.'}>
                <input value={content.sections.price.column1Label} onChange={(e) => updatePrice({ column1Label: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Column 2" hint='e.g. "Meal Included" — set per tour via its "Price table feature" field.'>
                <input value={content.sections.price.column2Label} onChange={(e) => updatePrice({ column2Label: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Column: best for" hint='e.g. "Best For"'>
                <input value={content.sections.price.bestForLabel} onChange={(e) => updatePrice({ bestForLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Row button label" hint='e.g. "Book"'>
                <input value={content.sections.price.bookLabel} onChange={(e) => updatePrice({ bookLabel: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Small note under the table">
              <textarea rows={2} value={content.sections.price.note} onChange={(e) => updatePrice({ note: e.target.value })} className={inputClass} />
            </Field>

            <div>
              <p className={labelClass}>Live preview</p>
              <p className="mb-2 text-xs text-stone-500">
                Exactly what's on the site right now, row by row. Row content (title, price, features)
                comes from each tour — edit it on the <Link href="/admin/tours" className="underline">Tours &amp; Tickets</Link> page.
              </p>
              {tours.length === 0 ? (
                <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-500">
                  No tours yet — add one on the Tours &amp; Tickets page to see it appear here.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full min-w-[640px] border-collapse bg-white text-left text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-600">
                        <th className="px-3 py-2 font-semibold">{content.sections.price.itemLabel || "—"}</th>
                        <th className="px-3 py-2 font-semibold">{content.sections.price.priceLabel || "—"}</th>
                        <th className="px-3 py-2 font-semibold">{content.sections.price.column1Label || "—"}</th>
                        <th className="px-3 py-2 font-semibold">{content.sections.price.column2Label || "—"}</th>
                        <th className="px-3 py-2 font-semibold">{content.sections.price.bestForLabel || "—"}</th>
                        <th className="px-3 py-2 font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map((tour, i) => (
                        <tr key={tour.id} className={`border-t border-stone-200 ${i % 2 ? "bg-stone-50" : ""}`}>
                          <td className="px-3 py-2 font-medium text-stone-900">{tour.title}</td>
                          <td className="px-3 py-2 text-stone-700">€{tour.price}</td>
                          <td className="px-3 py-2 text-stone-700">{tour.priceTableColumn1 || tour.duration}</td>
                          <td className="px-3 py-2 text-stone-700">{tour.priceTableFeature || "No"}</td>
                          <td className="px-3 py-2 text-stone-700">{tour.bestFor}</td>
                          <td className="px-3 py-2 text-right">
                            <Link href={`/admin/tours/${tour.id}`} className="font-medium text-seine-teal hover:underline">
                              Edit →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            id="sec-blogteaser"
            title="Blog teaser section"
            description={'The "From the Blog" section on the homepage, right above the FAQ.'}
            open={!!openSections["sec-blogteaser"]}
            onToggle={() => toggleSection("sec-blogteaser")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Eyebrow">
                <input value={content.sections.blogTeaser.eyebrow} onChange={(e) => updateBlogTeaser({ eyebrow: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Heading (H2)">
                <input value={content.sections.blogTeaser.heading} onChange={(e) => updateBlogTeaser({ heading: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Subheading">
              <textarea rows={2} value={content.sections.blogTeaser.subheading} onChange={(e) => updateBlogTeaser({ subheading: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={'"View all" button text'}>
                <input value={content.sections.blogTeaser.viewAllText} onChange={(e) => updateBlogTeaser({ viewAllText: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'"Read article" link text'}>
                <input value={content.sections.blogTeaser.readArticleText} onChange={(e) => updateBlogTeaser({ readArticleText: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-faq"
            title="FAQ section"
            description="The questions and answers themselves are edited from the FAQs admin page — this is just the heading above them."
            open={!!openSections["sec-faq"]}
            onToggle={() => toggleSection("sec-faq")}
          >
            <Field label="Heading (H2)">
              <input value={content.sections.faq.heading} onChange={(e) => updateFaq({ heading: e.target.value })} className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard
            id="sec-blogpages"
            title="Blog pages"
            description="Shared labels used across the blog listing page and every article page (not the posts themselves — edit those from /admin/posts)."
            open={!!openSections["sec-blogpages"]}
            onToggle={() => toggleSection("sec-blogpages")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Listing page eyebrow">
                <input value={content.sections.blogPage.eyebrow} onChange={(e) => updateBlogPage({ eyebrow: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Listing page heading (H1)">
                <input value={content.sections.blogPage.heading} onChange={(e) => updateBlogPage({ heading: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Listing page subheading">
              <input value={content.sections.blogPage.subheading} onChange={(e) => updateBlogPage({ subheading: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Empty-state message" hint="Shown when there are no posts yet.">
                <input value={content.sections.blogPage.emptyStateText} onChange={(e) => updateBlogPage({ emptyStateText: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'Featured post "Read the guide" link text'}>
                <input value={content.sections.blogPage.featuredLinkText} onChange={(e) => updateBlogPage({ featuredLinkText: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Bottom CTA heading">
                <input value={content.sections.blogPage.ctaHeading} onChange={(e) => updateBlogPage({ ctaHeading: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Bottom CTA button text">
                <input value={content.sections.blogPage.ctaButtonText} onChange={(e) => updateBlogPage({ ctaButtonText: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={'"Back to all guides" link text'}>
                <input value={content.sections.blogPage.backToGuidesText} onChange={(e) => updateBlogPage({ backToGuidesText: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'"Quick Answer" callout label'}>
                <input value={content.sections.blogPage.quickAnswerLabel} onChange={(e) => updateBlogPage({ quickAnswerLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'"In This Guide" box label'}>
                <input value={content.sections.blogPage.tocLabel} onChange={(e) => updateBlogPage({ tocLabel: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Related Guides heading">
                <input value={content.sections.blogPage.relatedGuidesHeading} onChange={(e) => updateBlogPage({ relatedGuidesHeading: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <p className="text-xs font-medium text-stone-500">Sidebar (shown next to every article)</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Recommended tour badge">
                <input value={content.sections.blogPage.sidebarRecommendedBadge} onChange={(e) => updateBlogPage({ sidebarRecommendedBadge: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Related Articles heading">
                <input value={content.sections.blogPage.sidebarRelatedHeading} onChange={(e) => updateBlogPage({ sidebarRelatedHeading: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Compare-all-cruises link text">
                <input value={content.sections.blogPage.sidebarCompareLinkText} onChange={(e) => updateBlogPage({ sidebarCompareLinkText: e.target.value })} className={inputClass} />
              </Field>
              <Field label={'Mid-article promo card "Recommended for you" label'}>
                <input value={content.sections.blogPage.promoRecommendedText} onChange={(e) => updateBlogPage({ promoRecommendedText: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-404"
            title="404 (page not found)"
            description="Shown when a visitor lands on a broken or missing link."
            open={!!openSections["sec-404"]}
            onToggle={() => toggleSection("sec-404")}
          >
            <Field label="Heading">
              <input value={content.sections.notFound.heading} onChange={(e) => updateNotFound({ heading: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Body text">
              <textarea rows={2} value={content.sections.notFound.body} onChange={(e) => updateNotFound({ body: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Primary button text">
                <input value={content.sections.notFound.primaryButtonText} onChange={(e) => updateNotFound({ primaryButtonText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Primary button link">
                <input value={content.sections.notFound.primaryButtonHref} onChange={(e) => updateNotFound({ primaryButtonHref: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Secondary button text">
                <input value={content.sections.notFound.secondaryButtonText} onChange={(e) => updateNotFound({ secondaryButtonText: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Secondary button link">
                <input value={content.sections.notFound.secondaryButtonHref} onChange={(e) => updateNotFound({ secondaryButtonHref: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="sec-footer"
            title="Footer"
            description="Shown at the bottom of every page."
            tone="sitewide"
            open={!!openSections["sec-footer"]}
            onToggle={() => toggleSection("sec-footer")}
          >
            <Field label="Tagline / disclosure text" hint="Supports bold and links.">
              <RichTextEditor value={content.footer.tagline} onChange={(html) => updateFooter({ tagline: html })} minHeight="4rem" />
            </Field>
            <Field label="Link columns">
              <RepeatableList<FooterColumn>
                items={content.footer.columns}
                onChange={(columns) => updateFooter({ columns })}
                newItem={() => ({ title: "New Column", links: [] })}
                addLabel="+ Add column"
                renderItem={(col, upd) => (
                  <div className="space-y-2">
                    <input value={col.title} onChange={(e) => upd({ ...col, title: e.target.value })} placeholder="Column title" className={inputClass} />
                    <RepeatableList<FooterLink>
                      items={col.links}
                      onChange={(links) => upd({ ...col, links })}
                      newItem={() => ({ label: "New link", href: "/" })}
                      addLabel="+ Add link"
                      renderItem={(link, updLink) => (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input value={link.label} onChange={(e) => updLink({ ...link, label: e.target.value })} placeholder="Label" className={inputClass} />
                          <input value={link.href} onChange={(e) => updLink({ ...link, href: e.target.value })} placeholder="/about" className={inputClass} />
                        </div>
                      )}
                    />
                  </div>
                )}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Address heading">
                <input value={content.footer.addressHeading} onChange={(e) => updateFooter({ addressHeading: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Copyright line" hint="Shown after the auto-inserted year.">
                <input value={content.footer.copyrightText} onChange={(e) => updateFooter({ copyrightText: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Address line 1">
                <input value={content.footer.addressLine1} onChange={(e) => updateFooter({ addressLine1: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Address line 2">
                <input value={content.footer.addressLine2} onChange={(e) => updateFooter({ addressLine2: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ---------------- SEO TAB ---------------- */}
      {activeTab === "seo" && (
        <div className="space-y-5">
          <SectionCard title="Search & Preview" description="Controls exactly what Google shows for the homepage.">
            <Field label="SEO title" hint="Shown as the blue link text in Google, and the browser tab. Leave blank to use the site-wide default.">
              <input value={content.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} className={inputClass} />
              <CharCounter length={content.metaTitle.length} min={40} max={60} />
            </Field>
            <Field label="Meta description" hint="The gray snippet under the title in Google search results.">
              <textarea rows={3} value={content.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} className={inputClass} />
              <CharCounter length={content.metaDescription.length} min={120} max={158} />
            </Field>
            <Field label="URL / slug" hint="The homepage always lives at the root URL — this can't be changed.">
              <input value="/" disabled className={`${inputClass} bg-stone-100 text-stone-500`} />
            </Field>
            <Field label="Canonical URL (optional)" hint="Leave blank to auto-generate from the site's own URL.">
              <input value={content.canonicalUrl} onChange={(e) => update("canonicalUrl", e.target.value)} className={inputClass} placeholder="Leave blank to auto-generate: /" />
            </Field>
            <SeoPreview title={content.metaTitle || content.heroHeading} description={content.metaDescription || content.heroSubheading.replace(/<[^>]+>/g, "")} path="/" />
          </SectionCard>

          <SectionCard title="Indexing & Link Following">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">Search Engine Indexing &amp; Link Following</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Currently{" "}
                  <span className={content.noIndex ? "font-medium text-amber-700" : "font-medium text-green-700"}>
                    {content.noIndex ? "noindex" : "index"}
                  </span>
                  {", "}
                  <span className={content.noFollow ? "font-medium text-amber-700" : "font-medium text-green-700"}>
                    {content.noFollow ? "nofollow" : "follow"}
                  </span>
                  . Managed from one place for every page on the site.
                </p>
              </div>
              <Link href="/admin/indexing" className="shrink-0 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50">
                Manage in Indexing →
              </Link>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ---------------- SOCIAL MEDIA TAB ---------------- */}
      {activeTab === "social" && (
        <div className="space-y-5">
          <SectionCard title="Open Graph &amp; Twitter/X Preview" description="Used when the homepage is shared on Facebook, WhatsApp, iMessage, Twitter/X, etc. Leave blank to fall back to the hero's own title/description/image.">
            <Field label="Social title (optional)">
              <input value={content.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Social description (optional)">
              <textarea rows={2} value={content.ogDescription} onChange={(e) => update("ogDescription", e.target.value)} className={inputClass} />
            </Field>
            <ImageUploadField label="Social share image (optional)" value={content.ogImage} onChange={(url) => update("ogImage", url)} aspectRatio={1.91 / 1} />

            <div className="overflow-hidden rounded-xl border border-stone-200">
              <div className="aspect-[1.91/1] w-full bg-stone-100">
                {(content.ogImage || content.heroImage) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.ogImage || content.heroImage} alt="Social preview" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="bg-stone-50 p-3">
                <p className="truncate text-xs uppercase tracking-wide text-stone-400">seine-river-cruise-tours.vercel.app</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-stone-900">{content.ogTitle || content.metaTitle || content.heroHeading}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">{(content.ogDescription || content.metaDescription || content.heroSubheading).replace(/<[^>]+>/g, "")}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ---------------- IMAGES TAB ---------------- */}
      {activeTab === "images" && (
        <div className="space-y-5">
          <SectionCard title="Logo" description="Overrides the site logo everywhere it appears (navbar + footer)." tone="sitewide">
            <ImageUploadField label="Logo image (leave blank to use the default)" value={content.header.logoImage} onChange={(url) => updateHeader({ logoImage: url })} />
            <Field label="Logo alt text">
              <input value={content.header.logoAlt} onChange={(e) => updateHeader({ logoAlt: e.target.value })} className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard title="Hero photo">
            <ImageUploadField label="Hero background photo" value={content.heroImage} onChange={(url) => update("heroImage", url)} aspectRatio={16 / 9} />
            <Field label="Hero photo alt text">
              <input value={content.heroImageAlt} onChange={(e) => update("heroImageAlt", e.target.value)} className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard title="Hero photo strip" description="The 4 small photos under the hero buttons.">
            <RepeatableList<GalleryImage>
              items={content.heroGallery}
              onChange={(heroGallery) => update("heroGallery", heroGallery)}
              newItem={() => ({ src: "", alt: "", label: "" })}
              addLabel="+ Add photo"
              renderItem={(img, upd) => (
                <div className="space-y-2">
                  <ImageUploadField label="Photo" value={img.src} onChange={(url) => upd({ ...img, src: url })} aspectRatio={1} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={img.label} onChange={(e) => upd({ ...img, label: e.target.value })} placeholder="Caption shown on the photo" className={inputClass} />
                    <input value={img.alt} onChange={(e) => upd({ ...img, alt: e.target.value })} placeholder="Alt text" className={inputClass} />
                  </div>
                </div>
              )}
            />
          </SectionCard>

          <SectionCard title="Illuminations Cruise photos">
            <RepeatableList<GalleryImage>
              items={content.sections.tower.images}
              onChange={(images) => updateTower({ images })}
              newItem={() => ({ src: "", alt: "", label: "" })}
              addLabel="+ Add photo"
              renderItem={(img, upd) => (
                <div className="space-y-2">
                  <ImageUploadField label="Photo" value={img.src} onChange={(url) => upd({ ...img, src: url })} aspectRatio={1} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={img.label} onChange={(e) => upd({ ...img, label: e.target.value })} placeholder="Caption shown on the photo" className={inputClass} />
                    <input value={img.alt} onChange={(e) => upd({ ...img, alt: e.target.value })} placeholder="Alt text" className={inputClass} />
                  </div>
                </div>
              )}
            />
          </SectionCard>
        </div>
      )}

      {/* ---------------- ADVANCED SEO TAB ---------------- */}
      {activeTab === "advanced" && (
        <div className="space-y-5">
          <SectionCard title="Focus keyword" description="The main phrase you want the homepage to rank for. Purely a writing aid — nothing here is sent to Google.">
            <Field label="Focus keyword">
              <input value={content.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} className={inputClass} placeholder="e.g. Seine River cruise" />
            </Field>
            {focusChecklist && (
              <ul className="space-y-1.5 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
                {focusChecklist.map((item) => (
                  <li key={item.label} className={`flex items-center gap-2 ${item.pass ? "text-green-700" : "text-amber-700"}`}>
                    <span>{item.pass ? "✓" : "!"}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Brand colors" description="Changes these colors everywhere they're used across the whole site — buttons, links, hero background, ratings. Leave a field blank to keep the default.">
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField label="Primary (buttons)" value={content.theme.primary} fallback="#e8823a" onChange={(hex) => updateTheme({ primary: hex })} />
              <ColorField label="Secondary (links, accents)" value={content.theme.secondary} fallback="#0c7489" onChange={(hex) => updateTheme({ secondary: hex })} />
              <ColorField label="Dark (hero background)" value={content.theme.dark} fallback="#0a2e35" onChange={(hex) => updateTheme({ dark: hex })} />
              <ColorField label="Accent (ratings, badges)" value={content.theme.accent} fallback="#e0a94a" onChange={(hex) => updateTheme({ accent: hex })} />
            </div>
          </SectionCard>

          <SectionCard title="Schema, sitemap &amp; robots" description="Technical SEO that's already wired up site-wide — shown here for visibility, not editable per-page.">
            <ul className="space-y-2 text-sm text-stone-700">
              <li>✓ Organization + WebSite structured data on every page (see the page source).</li>
              <li>✓ Product structured data (ratings, price) for every featured tour on the homepage.</li>
              <li>
                ✓ <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">/sitemap.xml</code> is generated automatically from every published page and post.
              </li>
              <li>
                ✓ <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">/robots.txt</code> is generated automatically and respects each page's Index/Follow setting.
              </li>
            </ul>
            <p className="text-xs text-stone-500">
              Per-page indexing is controlled from the <Link href="/admin/indexing" className="underline">Indexing</Link> tab.
            </p>
          </SectionCard>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur sm:pl-[17rem]">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="text-xs text-stone-500">Changes save across all tabs at once.</p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
