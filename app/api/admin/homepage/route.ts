import { NextResponse } from "next/server";
import { getHomepageContent, saveHomepageContent, type HomepageContent } from "@/lib/homepage";
import { dbErrorMessage } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getHomepageContent());
}

export async function PUT(req: Request) {
  const body = (await req.json()) as HomepageContent;
  try {
    await saveHomepageContent(body);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
