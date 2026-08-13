// Client-side helper shared by every image picker (RichImageModal,
// ImageUploadField) to record a URL into the permanent Media Library —
// not just files uploaded through this admin's own Upload button, but any
// external image URL an admin pastes in directly too, so it's available to
// reuse from the Media Library picker afterward, same as an upload. Fails
// silently: this is best-effort bookkeeping, never something that should
// block the image itself from being inserted/saved.
export async function recordMediaUrl(url: string): Promise<void> {
  if (!/^https?:\/\//i.test(url)) return;
  try {
    await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // best-effort only
  }
}
