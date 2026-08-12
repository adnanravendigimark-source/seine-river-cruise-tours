import { NextResponse } from "next/server";
import { getPageIndexingSettings, savePageIndexingSettings } from "@/lib/settings";
import { dbErrorMessage } from "@/lib/db";

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
