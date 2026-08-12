import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Saves an uploaded image to Vercel Blob storage and returns its public
// URL for use in a tour/post/homepage image field. Uses Blob (not the
// local filesystem) specifically because Vercel's deployed functions have
// a read-only filesystem at runtime — this works identically in local dev
// and in production as long as BLOB_READ_WRITE_TOKEN is set.
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't configured yet — add a Blob store to your Vercel project (Storage tab) and set BLOB_READ_WRITE_TOKEN in .env / your Vercel project's env vars. Paste an image URL instead for now.",
      },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is larger than 8MB." }, { status: 400 });
  }

  const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
  const rawExt = extMatch ? extMatch[0].toLowerCase() : ".jpg";
  const ext = /^\.(jpg|jpeg|png|webp|gif|svg)$/.test(rawExt) ? rawExt : ".jpg";
  const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed. " + ((err as Error).message || "Please try again or paste an image URL.") },
      { status: 500 }
    );
  }
}
