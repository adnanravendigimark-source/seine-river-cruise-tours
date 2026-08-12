/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Next.js 14.2 quietly reintroduced a *client-side* Router Cache for
    // already-visited routes — 30s for dynamic pages, 5min for static —
    // on top of (and separate from) each page's own `export const dynamic
    // = "force-dynamic"`. That server-side flag guarantees a fresh DB read
    // on every request the server actually handles, but it does nothing
    // for a soft navigation (clicking a <Link>, or coming back to a tab
    // you already had open) that Next can still serve out of that client
    // cache without hitting the server at all. That's exactly why admin
    // edits (homepage, blog, About/Contact/SEO toggles, everything) looked
    // like they "didn't save" until a hard refresh — the save worked, the
    // page you navigated to afterward just hadn't asked the server for new
    // data yet. Setting both to 0 disables that client cache entirely, so
    // every navigation always fetches fresh content.
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    // Editors can paste an image URL from anywhere (stock photo sites,
    // other travel blogs, etc.) as well as upload through the admin panel
    // (Vercel Blob) or use the original Unsplash photos — next/image
    // requires every external host to be allowlisted, and there's no way
    // to predict which domain an editor will paste next. Since only
    // authenticated admins/editors can set these URLs (never public input),
    // allowing any HTTPS host here is an acceptable trade-off for a CMS
    // like this rather than maintaining a domain list by hand.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
