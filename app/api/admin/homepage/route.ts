import { NextResponse } from "next/server";
import { getHomepageContent, saveHomepageContent, type HomepageContent } from "@/lib/homepage";
import { dbErrorMessage } from "@/lib/db";

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
