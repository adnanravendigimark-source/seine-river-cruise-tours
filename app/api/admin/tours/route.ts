import { NextResponse } from "next/server";
import { getToursRaw, saveTours, type TourRecord } from "@/lib/data";
import { dbErrorMessage } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getToursRaw());
}

export async function POST(req: Request) {
  const body = (await req.json()) as TourRecord;

  if (!body.id || !body.title) {
    return NextResponse.json({ error: "ID and title are required." }, { status: 400 });
  }

  const tours = await getToursRaw();
  if (tours.some((t) => t.id === body.id)) {
    return NextResponse.json({ error: "A tour with this ID already exists." }, { status: 400 });
  }

  tours.push(body);
  try {
    await saveTours(tours);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
