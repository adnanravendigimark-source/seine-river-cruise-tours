import { revalidatePath } from "next/cache";

// Public pages are statically cached (they no longer query Neon on every
// visit). After any successful admin write, purge the whole site's cache —
// every page plus cached DB reads — so the change shows on the next visit.
// The site is small, so a full purge costs one short DB wake per edit.
export function withSiteRevalidate<A extends unknown[]>(
  handler: (...args: A) => Promise<Response> | Response,
) {
  return async (...args: A): Promise<Response> => {
    const res = await handler(...args);
    if (res.ok) {
      try {
        revalidatePath("/", "layout");
      } catch (err) {
        console.error("[revalidate] failed to purge site cache", err);
      }
    }
    return res;
  };
}
