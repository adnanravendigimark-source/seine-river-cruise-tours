import { NextResponse } from "next/server";

// Force this route to always run as a live serverless function rather than
// get statically optimized at build time — Next.js can otherwise pre-render
// a GET-only static response for a route handler like this and silently drop
// every other exported method (PUT/POST/DELETE), returning 405 for all of
// them in production even though the code is correct.
export const dynamic = "force-dynamic";

// Combo Offers admin feature isn't used on this site. This route file is
// kept only so the folder isn't empty; both handlers are disabled rather
// than left functional.
export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
