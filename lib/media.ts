import { sql } from "./db";

// Backs the admin's Media Library — a permanent record of every image ever
// uploaded through the admin, independent of which post/tour/page field
// currently happens to reference it. Nothing in this app ever deletes a
// Blob or a row here: replacing a field's image just points that field at
// a new URL, the old file stays live and listed here so it (or any other
// past upload) can be reused later instead of re-uploaded.
export interface MediaItem {
  id: number;
  url: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

// Called once, right after a successful Blob upload — fails soft (same
// policy as the rest of this app when the schema is behind the code) so a
// database hiccup here never blocks the actual upload from succeeding.
export async function recordMediaUpload(item: {
  url: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}): Promise<void> {
  try {
    await sql`
      INSERT INTO media_library (url, filename, content_type, size_bytes)
      VALUES (${item.url}, ${item.filename}, ${item.contentType}, ${item.sizeBytes})
      ON CONFLICT (url) DO NOTHING
    `;
  } catch {
    // Table may not exist yet on a database that hasn't run the latest
    // `node scripts/setup-db.mjs` — the upload itself still succeeded.
  }
}

// Newest-first, capped at a generous limit — plenty for a picker grid
// without risking an unbounded response as the library grows over years
// of uploads.
export async function getMediaLibrary(): Promise<MediaItem[]> {
  try {
    const rows = await sql`
      SELECT id, url, filename, content_type, size_bytes, created_at
      FROM media_library
      ORDER BY created_at DESC
      LIMIT 300
    `;
    return rows.map((r) => ({
      id: r.id as number,
      url: r.url as string,
      filename: r.filename as string,
      contentType: r.content_type as string,
      sizeBytes: r.size_bytes as number,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : "",
    }));
  } catch {
    return [];
  }
}
