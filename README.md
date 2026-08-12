# Seine River Cruise Tours — Homepage (Next.js)

A GetYourGuide affiliate site for Seine River cruise tickets — a tour-first
homepage (hero, trust badges, tour grid, price comparison, FAQ with schema)
plus a full `/admin` content CMS, targeting "Seine River cruise Paris,"
"Seine dinner cruise," and "best Seine River cruise" in the title/H1/meta.

## 1. Install & run locally

Requires Node.js 18.17+.

```bash
cd seine-river-cruise-tours
npm install
npm run dev
```

Open http://localhost:3000. The site works immediately with real starter
content (3 cruise products, FAQs, 3 blog posts) even before you set up a
database — see "Content storage" below.

## 2. Add your real GetYourGuide affiliate link

Open `lib/data.ts` and replace:

```ts
export const PARTNER_ID = process.env.GYG_PARTNER_ID || "YOUR_PARTNER_ID";
```

with your actual GetYourGuide partner ID (either directly here, or via the
`GYG_PARTNER_ID` value in `.env`). Every "Book Now" button reads from this
one constant. Once you're logged into `/admin`, you can also edit each
tour's GetYourGuide link path directly from the Tours & Tickets page — no
code changes needed for day-to-day edits.

## 3. Content storage (database is optional to get started)

All admin-editable content (tours, posts,
homepage copy, FAQs, users) is designed to live in Neon Postgres so a
non-technical editor can change it from `/admin` with the change going live
immediately — no rebuild or redeploy.

**Until you set up a database, the site falls back to the real Seine River
Cruise starter content baked into `/data` (tours, FAQs, homepage copy, and 3
blog posts)** — so it's fully browsable and demo-ready out of the box.
Saving changes from `/admin` won't persist anywhere until `DATABASE_URL` is
set, though — the admin panel will show a "couldn't be reached" error on
save until then.

To turn on the live CMS:

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy Connection Details → "Pooled connection" string into `DATABASE_URL`
   in `.env`.
3. Also add the same `DATABASE_URL` to your Vercel project's Settings →
   Environment Variables (all environments) before deploying.
4. Run: `node scripts/setup-db.mjs` — creates the tables and seeds them
   from the `/data/*.json` files (safe to re-run; only seeds empty tables).
5. Redeploy.

## 4. Admin CMS

Visit `/admin/login`. The owner account is whatever you set
`ADMIN_EMAIL` / `ADMIN_PASSWORD` to in `.env` (defaults to
`admin@gmail.com` / `12345678` — **change this before going live**). From
there you can add editor accounts with access to specific sections (Tours,
Blog Posts, FAQs, Homepage, Privacy Policy, or About/Contact/Blog SEO) from
the Users page.

## 5. Photography

The hero and tour photography use real, free-to-use photos of the Eiffel
Tower, Seine River, Pont Alexandre III, and Notre-Dame from Unsplash (free
for commercial use, no attribution required — credits are in a code comment
at the top of `components/Hero.tsx`). Swap in your own or licensed photos
of the actual boats/operators you're promoting whenever you have them —
nothing beats real photos of the actual cruise.

## 6. Deploying

Standard Next.js App Router project — deploys as-is to Vercel, Netlify, or
any Node host. `npm run build && npm run start` for a production build.
# seine-river-cruise-tours
