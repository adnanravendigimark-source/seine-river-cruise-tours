// Post bodies are admin-written HTML. Any GetYourGuide link in them is an
// affiliate link, so it must always carry rel="sponsored nofollow", open in
// a new tab and report a placement to the click tracker, whatever the
// editor stored (the paste cleaner in RichTextEditor rewrites rel to
// "noopener noreferrer"). Applied at render time so no stored post can
// slip through. Other links are left untouched.
const GYG_ANCHOR = /<a\b([^>]*\bhref\s*=\s*["']https:\/\/(?:[a-z0-9-]+\.)*getyourguide\.com[^"']*["'][^>]*)>/gi;

export function enforceAffiliateLinks(html: string): string {
  if (!html || !/getyourguide\.com/i.test(html)) return html;
  return html.replace(GYG_ANCHOR, (_match, attrs: string) => {
    let a = attrs
      .replace(/\s+rel\s*=\s*(["'])[^"']*\1/gi, "")
      .replace(/\s+target\s*=\s*(["'])[^"']*\1/gi, "");
    if (!/\bdata-placement\s*=/i.test(a)) a += ' data-placement="post_body"';
    return `<a${a} target="_blank" rel="noopener nofollow sponsored">`;
  });
}
