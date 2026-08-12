import { sql } from "./db";

export interface ContactReason {
  icon: string;
  title: string;
  body: string;
}

export interface ContactPageContent {
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  email: string;
  emailNote: string;
  reasonsHeading: string;
  reasons: ContactReason[];
  footerNote: string;
  ctaHeading: string;
  ctaButtonLabel: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const DEFAULT_CONTACT: ContactPageContent = {
  heroEyebrow: "Contact",
  heroHeading: "Get in Touch",
  heroSubheading:
    "Questions about a Seine River cruise or ticket — or a partnership inquiry? Reach out directly by email.",
  email: "livetravelpartner@gmail.com",
  emailNote: "We typically reply within 1–2 business days.",
  reasonsHeading: "What we can help with",
  reasons: [
    { icon: "HeadsetIcon", title: "Booking Help", body: "Not sure whether to book the sightseeing cruise, dinner cruise, or evening illuminations cruise? Ask before you book." },
    { icon: "BriefcaseIcon", title: "Partnerships & Affiliates", body: "Cruise operators, DMCs, and affiliate partners — reach out about listing or collaboration opportunities." },
    { icon: "MailIcon", title: "General Questions", body: "Site feedback, content corrections, or anything else about Seine River cruises." },
  ],
  footerNote:
    "Already have a booking? Contact the cruise operator directly via your confirmation email — they handle changes and refunds faster than we can.",
  ctaHeading: "Not booked yet?",
  ctaButtonLabel: "Compare Seine River Cruises & Tickets",
  metaTitle: "Contact Us | Seine River Cruise Tours",
  metaDescription:
    "Questions about booking a Seine River sightseeing cruise, dinner cruise, or tickets online? Reach out directly — including for partnership and affiliate inquiries.",
  canonicalUrl: "",
  noIndex: false,
  noFollow: false,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

function parseReasons(value: unknown): ContactReason[] {
  if (Array.isArray(value)) return value as ContactReason[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToContact(row: any): ContactPageContent {
  return {
    heroEyebrow: row.hero_eyebrow ?? DEFAULT_CONTACT.heroEyebrow,
    heroHeading: row.hero_heading ?? DEFAULT_CONTACT.heroHeading,
    heroSubheading: row.hero_subheading ?? DEFAULT_CONTACT.heroSubheading,
    email: row.email || DEFAULT_CONTACT.email,
    emailNote: row.email_note ?? DEFAULT_CONTACT.emailNote,
    reasonsHeading: row.reasons_heading ?? DEFAULT_CONTACT.reasonsHeading,
    reasons: parseReasons(row.reasons).length ? parseReasons(row.reasons) : DEFAULT_CONTACT.reasons,
    footerNote: row.footer_note ?? DEFAULT_CONTACT.footerNote,
    ctaHeading: row.cta_heading ?? DEFAULT_CONTACT.ctaHeading,
    ctaButtonLabel: row.cta_button_label ?? DEFAULT_CONTACT.ctaButtonLabel,
    metaTitle: row.meta_title || DEFAULT_CONTACT.metaTitle,
    metaDescription: row.meta_description || DEFAULT_CONTACT.metaDescription,
    canonicalUrl: row.canonical_url || "",
    noIndex: !!row.no_index,
    noFollow: !!row.no_follow,
    ogTitle: row.og_title || "",
    ogDescription: row.og_description || "",
    ogImage: row.og_image || "",
  };
}

export async function getContactPage(): Promise<ContactPageContent> {
  try {
    const rows = await sql`SELECT * FROM contact_page WHERE id = 1 LIMIT 1`;
    return rows.length ? rowToContact(rows[0]) : DEFAULT_CONTACT;
  } catch {
    return DEFAULT_CONTACT;
  }
}

// Touches ONLY the indexing columns — used by the centralized "Indexing"
// admin tab (/admin/indexing).
export async function setContactIndexing(noIndex: boolean, noFollow: boolean): Promise<void> {
  await sql`
    INSERT INTO contact_page (id, no_index, no_follow)
    VALUES (1, ${!!noIndex}, ${!!noFollow})
    ON CONFLICT (id) DO UPDATE SET
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow
  `;
}

export async function saveContactPage(data: ContactPageContent): Promise<void> {
  await sql`
    INSERT INTO contact_page (
      id, hero_eyebrow, hero_heading, hero_subheading, email, email_note,
      reasons_heading, reasons, footer_note, cta_heading, cta_button_label,
      meta_title, meta_description, canonical_url, no_index, no_follow,
      og_title, og_description, og_image
    ) VALUES (
      1, ${data.heroEyebrow}, ${data.heroHeading}, ${data.heroSubheading}, ${data.email}, ${data.emailNote},
      ${data.reasonsHeading}, ${JSON.stringify(data.reasons || [])}::jsonb, ${data.footerNote}, ${data.ctaHeading}, ${data.ctaButtonLabel},
      ${data.metaTitle}, ${data.metaDescription}, ${data.canonicalUrl || ""}, ${!!data.noIndex}, ${!!data.noFollow},
      ${data.ogTitle || ""}, ${data.ogDescription || ""}, ${data.ogImage || ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      hero_eyebrow = EXCLUDED.hero_eyebrow,
      hero_heading = EXCLUDED.hero_heading,
      hero_subheading = EXCLUDED.hero_subheading,
      email = EXCLUDED.email,
      email_note = EXCLUDED.email_note,
      reasons_heading = EXCLUDED.reasons_heading,
      reasons = EXCLUDED.reasons,
      footer_note = EXCLUDED.footer_note,
      cta_heading = EXCLUDED.cta_heading,
      cta_button_label = EXCLUDED.cta_button_label,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      canonical_url = EXCLUDED.canonical_url,
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image
  `;
}
