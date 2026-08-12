import { NextResponse } from "next/server";
import { getPrivacyPolicy, savePrivacyPolicy } from "@/lib/legal";
import { dbErrorMessage } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPrivacyPolicy());
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const title = (body?.title || "").trim();
  const content = Array.isArray(body?.content) ? body.content : [];
  const noIndex = !!body?.noIndex;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    await savePrivacyPolicy({ title, content, noIndex });
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
