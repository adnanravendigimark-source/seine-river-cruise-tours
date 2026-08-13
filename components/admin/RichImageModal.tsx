"use client";

import { useRef, useState } from "react";
import CropModal from "./CropModal";
import { useToast } from "./Toast";

// The upload/crop device for images inserted inline inside a paragraph's
// rich text (via RichTextEditor's "Image" toolbar button) — mirrors
// ImageUploadField's upload-or-paste-a-URL UI plus the same WhatsApp-style
// crop step, instead of a bare window.prompt() asking for a pre-uploaded
// URL. Kept as its own component (rather than reusing ImageUploadField
// directly) because this is a one-shot "pick, then insert" flow with its
// own Insert/Cancel actions, not a field bound to a single persistent value.
export default function RichImageModal({
  onInsert,
  onClose,
}: {
  onInsert: (opts: { url: string; alt: string }) => void;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{ file: File; url: string } | null>(null);
  const [recropSrc, setRecropSrc] = useState<string | null>(null);

  async function upload(file: File | Blob, name = "image.jpg") {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file, file instanceof File ? file.name : name);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Upload failed.";
        setError(msg);
        showToast("error", msg);
      } else {
        setUrl(data.url);
        showToast("success", "Image uploaded.");
      }
    } catch {
      const msg = "Upload failed. Please try again.";
      setError(msg);
      showToast("error", msg);
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelected(file: File) {
    setPendingFile({ file, url: URL.createObjectURL(file) });
  }

  function closePendingFile() {
    if (pendingFile) URL.revokeObjectURL(pendingFile.url);
    setPendingFile(null);
  }

  function handleCropConfirm(blob: Blob) {
    closePendingFile();
    upload(blob, "cropped.jpg");
  }

  function handleCropUseOriginal() {
    if (!pendingFile) return;
    const file = pendingFile.file;
    closePendingFile();
    upload(file);
  }

  function handleRecropConfirm(blob: Blob) {
    setRecropSrc(null);
    upload(blob, "cropped.jpg");
  }

  function handleInsert() {
    if (!url) {
      showToast("error", "Add an image first — upload a file or paste a URL.");
      return;
    }
    onInsert({ url, alt });
    showToast("success", "Image inserted.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-stone-900">Insert image</h3>
        <p className="mt-1 text-sm text-stone-500">Upload a photo from your device, or paste an image URL.</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://... or upload a file"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="shrink-0 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
              e.target.value = "";
            }}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

        {url && (
          <div className="mt-3 flex items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Preview"
              className="h-28 min-w-0 flex-1 rounded-lg border border-stone-200 object-cover"
            />
            <div className="flex shrink-0 flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setRecropSrc(url)}
                className="whitespace-nowrap rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Adjust crop
              </button>
              <button
                type="button"
                onClick={() => setUrl("")}
                className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                Remove image
              </button>
            </div>
          </div>
        )}

        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-stone-700">Alt text (optional)</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the photo for screen readers and Google Images"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-seine-teal focus:outline-none focus:ring-1 focus:ring-seine-teal"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!url || uploading}
            className="rounded-lg bg-seine-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-seine-teal/90 disabled:opacity-60"
          >
            Insert image
          </button>
        </div>
      </div>

      {pendingFile && (
        <CropModal
          src={pendingFile.url}
          aspectRatio={16 / 9}
          onCancel={closePendingFile}
          onConfirm={handleCropConfirm}
          onUseOriginal={handleCropUseOriginal}
        />
      )}
      {recropSrc && (
        <CropModal
          src={recropSrc}
          aspectRatio={16 / 9}
          onCancel={() => setRecropSrc(null)}
          onConfirm={handleRecropConfirm}
        />
      )}
    </div>
  );
}
