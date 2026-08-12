import { NextResponse } from "next/server";

// Combo Offers admin feature isn't used on this site. This route file is
// kept only so the folder isn't empty; both handlers are disabled rather
// than left functional.
export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
