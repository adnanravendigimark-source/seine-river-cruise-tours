"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  url,
  confirmMessage,
  label = "Delete",
}: {
  url: string;
  confirmMessage: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed. Please try again.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-60"
    >
      {loading ? "Deleting…" : label}
    </button>
  );
}
