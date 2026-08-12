import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPrivacyPolicy } from "@/lib/legal";
import { resolveRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLE = "Privacy Policy | Seine River Cruise Tours";
const DESCRIPTION =
  "How this independent Seine River cruise and ticket guide handles your information, affiliate links, and cookies.";

// Static title/description/OG kept exactly as before — only `robots` is
// now resolved dynamically per the admin-editable per-page toggle, so this
// had to move from a static `metadata` export to `generateMetadata`.
export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPrivacyPolicy();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/privacy-policy" },
    robots: resolveRobots(policy.noIndex),
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  const policy = await getPrivacyPolicy();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl">{policy.title}</h1>
        {policy.lastUpdated && (
          <p className="mt-2 text-sm text-stone-900/50">Last updated: {policy.lastUpdated}</p>
        )}

        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-stone-900/80">
          {policy.content.map((block, i) => (
            <div key={i}>
              {block.type === "heading" && (
                <h2 className="font-display text-xl font-semibold text-stone-900">{block.text}</h2>
              )}
              {block.type === "paragraph" && <p>{block.text}</p>}
              {block.type === "list" && (
                <ul className="list-disc space-y-2 pl-5">
                  {(block.items || []).map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {policy.content.length === 0 && (
            <p className="text-stone-900/50">This page hasn't been filled in yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
