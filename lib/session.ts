import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME, type Session } from "./auth";

// Server-only helper (Server Components + Route Handlers) to read who's
// logged in and what role they have. Middleware already blocks unauthenticated
// requests from reaching these at all — this is for role-based decisions
// once we know a valid session exists (e.g. hiding delete buttons, gating
// the Users page to admins).
export async function getSession(): Promise<Session | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
