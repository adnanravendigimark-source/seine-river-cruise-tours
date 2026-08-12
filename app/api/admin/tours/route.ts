import { NextResponse } from "next/server";
import { getToursRaw, saveTours, type TourRecord } from "@/lib/data";
import { DB_ERROR_MESSAGE } from "@/lib/db";

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
  } catch {
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
