// Post bodies come from the rich-text editor as raw HTML, so their <img>
// tags point straight at the uploaded originals (often 2–3 MB PNGs). This
// rewrites each one to go through Next's built-in image optimizer — the
// same /_next/image endpoint next/image uses on the homepage — so browsers
// get a resized WebP/AVIF instead. Pure string transform, run on the server
// at render time; nothing stored in the database changes.
const WIDTHS = [640, 828, 1200]; // all in Next's default deviceSizes
const SIZES = "(min-width: 1024px) 760px, 100vw";

function decodeAttr(value: string): string {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function optimizable(src: string): boolean {
  if (src.startsWith("/_next/image")) return false;
  if (!(src.startsWith("https://") || (src.startsWith("/") && !src.startsWith("//")))) return false;
  return !/\.svg(\?|#|$)/i.test(src);
}

function imageUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export function optimizeContentImages(html: string): string {
  return (html || "").replace(/<img\b[^>]*>/gi, (tag) => {
    const m = tag.match(/\ssrc\s*=\s*"([^"]*)"/i);
    if (!m) return tag;
    const src = decodeAttr(m[1]).trim();
    if (!optimizable(src)) return tag;
    let out = tag.replace(m[0], ` src="${imageUrl(src, WIDTHS[WIDTHS.length - 1])}"`);
    const extra: string[] = [];
    if (!/\ssrcset\s*=/i.test(out)) extra.push(`srcset="${WIDTHS.map((w) => `${imageUrl(src, w)} ${w}w`).join(", ")}"`);
    if (!/\ssizes\s*=/i.test(out)) extra.push(`sizes="${SIZES}"`);
    if (!/\sloading\s*=/i.test(out)) extra.push(`loading="lazy"`);
    if (!/\sdecoding\s*=/i.test(out)) extra.push(`decoding="async"`);
    return extra.length ? out.replace(/\s*\/?>$/, (end) => ` ${extra.join(" ")}${end.includes("/") ? " />" : ">"}`) : out;
  });
}
