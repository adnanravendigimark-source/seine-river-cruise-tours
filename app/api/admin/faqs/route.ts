import { NextResponse } from "next/server";
import { getFaqs, saveFaqs, type FAQ } from "@/lib/data";
import { DB_ERROR_MESSAGE } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getFaqs());
}

export async function PUT(req: Request) {
  const body = (await req.json()) as FAQ[];
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array of FAQs." }, { status: 400 });
  }
  try {
    await saveFaqs(body);
  } catch {
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
