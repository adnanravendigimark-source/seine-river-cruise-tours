// Post bodies are admin-written HTML. Any GetYourGuide link in them is an
// affiliate link, so it must always carry rel="sponsored nofollow", open in
// a new tab and report a placement to the click tracker, whatever the
// editor stored (the paste cleaner in RichTextEditor rewrites rel to
// "noopener noreferrer"). Applied at render time so no stored post can
// slip through. Internal links are forced to follow (below); other external
// links are left untouched.
const GYG_ANCHOR = /<a\b([^>]*\bhref\s*=\s*["']https:\/\/(?:[a-z0-9-]+\.)*getyourguide\.com[^"']*["'][^>]*)>/gi;

// Internal links (relative, #anchors, or our own domain) must always be
// followed. The editor's "nofollow" toggle has been applied to some of them in
// stored posts, so strip nofollow/sponsored/ugc from internal anchors here.
const INTERNAL_ANCHOR = /<a\b([^>]*\bhref\s*=\s*["'](?:\/(?!\/)|#|https?:\/\/(?:www\.)?seineboatcruise\.com)[^"']*["'][^>]*)>/gi;

function followInternalLinks(html: string): string {
  return html.replace(INTERNAL_ANCHOR, (_match, attrs: string) => {
    const a = attrs.replace(/\s+rel\s*=\s*(["'])([^"']*)\1/gi, (_m, q: string, rel: string) => {
      const kept = rel.split(/\s+/).filter((t) => t && !/^(nofollow|sponsored|ugc)$/i.test(t));
      return kept.length ? ` rel=${q}${kept.join(" ")}${q}` : "";
    });
    return `<a${a}>`;
  });
}

export function enforceAffiliateLinks(html: string): string {
  if (!html) return html;
  html = followInternalLinks(html);
  if (!/getyourguide\.com/i.test(html)) return html;
  return html.replace(GYG_ANCHOR, (_match, attrs: string) => {
    let a = attrs
      .replace(/\s+rel\s*=\s*(["'])[^"']*\1/gi, "")
      .replace(/\s+target\s*=\s*(["'])[^"']*\1/gi, "");
    if (!/\bdata-placement\s*=/i.test(a)) a += ' data-placement="post_body"';
    return `<a${a} target="_blank" rel="noopener nofollow sponsored">`;
  });
}
