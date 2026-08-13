"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import type { FAQ } from "@/lib/data";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";

export default function FaqsForm({ initial }: { initial: FAQ[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update(i: number, field: keyof FAQ, value: string) {
    const next = [...faqs];
    next[i] = { ...next[i], [field]: value };
    setFaqs(next);
    setSaved(false);
  }

  function addFaq() {
    setFaqs([...faqs, { question: "", answer: "" }]);
  }

  function removeFaq(i: number) {
    setFaqs(faqs.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqs.filter((f) => f.question.trim() && f.answer.trim())),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved — live on the homepage FAQ section now.</p>}

      {faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">FAQ {i + 1}</span>
            <button type="button" onClick={() => removeFaq(i)} className="text-xs font-medium text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, "question", e.target.value)}
            placeholder="Question"
            className={`${inputClass} mb-2`}
          />
          <RichTextEditor
            value={faq.answer}
            onChange={(html) => update(i, "answer", html)}
            placeholder="Answer"
            minHeight="4rem"
            allowedHeadings={[]}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addFaq}
        className="rounded-lg border border-dashed border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
      >
        + Add FAQ
      </button>

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
