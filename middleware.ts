import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import type { PageKey } from "@/lib/pageAccess";

// Gate everything under /admin (except the login page itself) and every
// /api/admin/* route behind a valid signed session cookie. /admin/users and
// /api/admin/users are further restricted to the admin role — editors don't
// get to see that page even exists. Beyond that, each content section is
// gated by the session's `pages` list (set at login from the user's saved
// permissions) — an editor only granted "Blog Posts" access gets redirected
// away from /admin/tours, /admin/homepage, etc., and their matching API
// routes 403.
const PAGE_ROUTES: { key: PageKey; test: (p: string) => boolean }[] = [
  {
    key: "homepage",
    test: (p) =>
      p.startsWith("/admin/homepage") ||
      p.startsWith("/admin/recommended") ||
      p.startsWith("/api/admin/homepage") ||
      p.startsWith("/api/admin/recommended"),
  },
  { key: "tours", test: (p) => p.startsWith("/admin/tours") || p.startsWith("/api/admin/tours") },
  { key: "posts", test: (p) => p.startsWith("/admin/posts") || p.startsWith("/api/admin/posts") },
  { key: "faqs", test: (p) => p.startsWith("/admin/faqs") || p.startsWith("/api/admin/faqs") },
  { key: "privacy", test: (p) => p.startsWith("/admin/privacy") || p.startsWith("/api/admin/privacy") },
  { key: "about", test: (p) => p.startsWith("/admin/about") || p.startsWith("/api/admin/about") },
  { key: "contact", test: (p) => p.startsWith("/admin/contact") || p.startsWith("/api/admin/contact") },
  { key: "pages", test: (p) => p.startsWith("/admin/pages") || p.startsWith("/api/admin/settings") },
];

// Every response from this middleware gets an X-Robots-Tag: noindex,
// nofollow header — covers /admin/* HTML pages AND /api/admin/* JSON
// responses in one place (a <meta name="robots"> tag only works on real
// HTML, so the header is the only mechanism that works for both).
//
// Deliberately NOT paired with a robots.txt Disallow for these paths —
// per Google's own guidance, combining the two backfires: if robots.txt
// blocks crawling, Googlebot can never fetch the page to see this header,
// and the URL can still get indexed with no snippet. Leaving these paths
// crawlable (they require login anyway, so there's nothing to see) lets
// Googlebot actually reach them, read this header, and fully drop them
// from the index instead.
function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

// Every content page (home, about, blog, tours, etc.) already reads
// admin-edited content straight from the database on every request
// (`export const dynamic = "force-dynamic"` on all of them) — but without
// an explicit Cache-Control header, the *browser itself* can still reuse a
// cached copy of the previous HTML response on a normal reload or
// navigation, so a save in /admin only visibly showed up after a hard
// refresh (which bypasses the browser's HTTP cache). This forces every
// browser/proxy to always revalidate with the server for every page, so a
// normal refresh — or just navigating to the page — is enough to see the
// latest saved content immediately, no hard refresh needed. Only applies
// to page/API responses; the matcher below already excludes static assets
// (_next/static, images, etc.), which should stay cacheable as normal.
function withNoCache(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, must-revalidate");
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    const res = withNoCache(NextResponse.next());
    return isAdminArea ? withNoIndex(res) : res;
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    if (isAdminApi) {
      return withNoCache(withNoIndex(NextResponse.json({ error: "Unauthorized" }, { status: 401 })));
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return withNoCache(withNoIndex(NextResponse.redirect(loginUrl)));
  }

  const isUsersArea = pathname.startsWith("/admin/users") || pathname.startsWith("/api/admin/users");
  // The Indexing tab changes Index/Follow across every content section at
  // once (homepage, every post, privacy, about, contact) — restricted to
  // admins only, same as Users, rather than gated by a per-section
  // PAGE_KEY an editor could be individually granted.
  const isIndexingArea = pathname.startsWith("/admin/indexing") || pathname.startsWith("/api/admin/indexing");
  if ((isUsersArea || isIndexingArea) && session.role !== "admin") {
    if (isAdminApi) {
      return withNoCache(withNoIndex(NextResponse.json({ error: "Admins only." }, { status: 403 })));
    }
    return withNoCache(withNoIndex(NextResponse.redirect(new URL("/admin", req.url))));
  }

  if (session.role !== "admin") {
    const matched = PAGE_ROUTES.find((r) => r.test(pathname));
    if (matched && !session.pages.includes(matched.key)) {
      if (isAdminApi) {
        return withNoCache(
          withNoIndex(NextResponse.json({ error: "You don't have access to this section." }, { status: 403 }))
        );
      }
      return withNoCache(withNoIndex(NextResponse.redirect(new URL("/admin", req.url))));
    }
  }

  return withNoCache(withNoIndex(NextResponse.next()));
}

// Runs on every page and API route except Next's own static asset paths
// (_next/static, _next/image) and the favicon — those should stay
// cacheable as normal. Everything else is admin-editable content, so it
// all gets the no-cache header above, and the /admin & /api/admin subset
// additionally gets the auth/access-control logic and noindex header.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
