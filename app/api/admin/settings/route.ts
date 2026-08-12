import { NextResponse } from "next/server";
import { getPageIndexingSettings, savePageIndexingSettings } from "@/lib/settings";
import { DB_ERROR_MESSAGE } from "@/lib/db";

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
  } catch {
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
