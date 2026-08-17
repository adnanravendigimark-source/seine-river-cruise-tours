import { NextResponse } from "next/server";
import { getToursRaw, saveTours, type TourRecord } from "@/lib/data";
import { getSession } from "@/lib/session";
import { dbErrorMessage } from "@/lib/db";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const tour = (await getToursRaw()).find((t) => t.id === params.id);
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tour);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as TourRecord;
  const tours = await getToursRaw();
  const idx = tours.findIndex((t) => t.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  tours[idx] = { ...body, id: params.id };
  try {
    await saveTours(tours);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete." }, { status: 403 });
  }

  const tours = await getToursRaw();
  const next = tours.filter((t) => t.id !== params.id);
  if (next.length === tours.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await saveTours(next);
  } catch (err) {
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
