import { NextResponse } from "next/server";
import { getPrivacyPolicy, savePrivacyPolicy } from "@/lib/legal";
import { dbErrorMessage } from "@/lib/db";

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
