"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_KEYS, PAGE_LABELS, type PageKey } from "@/lib/pageAccess";
import type { SafeUser } from "@/lib/users";

const inputClass =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal";
const labelClass = "mb-1 block text-sm font-medium text-stone-700";

export default function UserEditForm({ user, onCancel }: { user: SafeUser; onCancel?: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"editor" | "admin">(user.role);
  const [pages, setPages] = useState<PageKey[]>(user.pages);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
    setSaved(false);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, pages, password: password || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    setPassword("");
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Saved — they'll see these changes next time they log in.
        </p>
      )}

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as "editor" | "admin")} className={inputClass}>
          <option value="editor">Editor — view &amp; edit only</option>
          <option value="admin">Admin — full access</option>
        </select>
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
        </div>
      )}

      <div>
        <label className={labelClass}>Reset password (optional)</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Leave blank to keep their current password"
        />
      </div>

      <div className="flex gap-3 border-t border-stone-200 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-seine-amber/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
              return;
            }
            router.push("/admin/users");
          }}
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
