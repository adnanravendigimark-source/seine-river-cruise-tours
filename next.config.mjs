/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
