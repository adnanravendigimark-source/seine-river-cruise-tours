import { NextResponse } from "next/server";
import { getPageIndexingSettings, savePageIndexingSettings } from "@/lib/settings";
import { dbErrorMessage } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

// Access to /admin/pages and /api/admin/settings is gated by the "pages"
// page-access key in middleware.ts, same pattern as posts/homepage/privacy
// — no extra in-route auth check needed here.

export async function GET() {
  return NextResponse.json(await getPageIndexingSettings());
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const data = {
    aboutNoIndex: !!body?.aboutNoIndex,
    contactNoIndex: !!body?.contactNoIndex,
    blogNoIndex: !!body?.blogNoIndex,
  };

  try {
    await savePageIndexingSettings(data);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
