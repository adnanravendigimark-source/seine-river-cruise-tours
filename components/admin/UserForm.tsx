"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_KEYS, PAGE_LABELS, type PageKey } from "@/lib/pageAccess";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";

export default function UserForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [pages, setPages] = useState<PageKey[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function togglePage(key: PageKey) {
    setPages((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "editor" && pages.length === 0) {
      setError("Select at least one page this editor can access.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, pages }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not create user.");
      return;
    }
    setEmail("");
    setPassword("");
    setRole("editor");
    setPages([]);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="writer@example.com"
          />
        </div>
        <div className="sm:col-span-1">
          <label className={labelClass}>Password</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => {
                const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
                let generated = "";
                for (let i = 0; i < 12; i++) generated += chars[Math.floor(Math.random() * chars.length)];
                setPassword(generated);
              }}
              className="shrink-0 rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50"
            >
              Generate
            </button>
          </div>
        </div>
        <div className="sm:col-span-1">
          <label className={labelClass}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as "editor" | "admin")} className={inputClass}>
            <option value="editor">Editor — view &amp; edit only</option>
            <option value="admin">Admin — full access</option>
          </select>
        </div>
      </div>

      {role === "editor" && (
        <div>
          <label className={labelClass}>Which pages can they access?</label>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {PAGE_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-1.5 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={pages.includes(key)}
                  onChange={() => togglePage(key)}
                  className="h-[18px] w-[18px] rounded border-stone-300 text-seine-amber focus:ring-seine-teal"
                />
                {PAGE_LABELS[key]}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-stone-500">
            They'll only see and be able to edit the sections checked above — everything else stays
            hidden from their admin sidebar.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
      >
        {saving ? "Creating…" : "Create User"}
      </button>
    </form>
  );
}
