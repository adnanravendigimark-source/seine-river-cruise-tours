// DEPRECATED — no longer used. Content used to live in flat JSON files
// under /data, read/written via fs here. That doesn't work on serverless
// hosts like Vercel (read-only filesystem at runtime), so the data layer
// (lib/data.ts, lib/posts.ts, lib/homepage.ts, lib/users.ts) was migrated
// to Postgres (Neon) — see lib/db.ts. This file is kept only so a stray
// import doesn't hard-crash the build; nothing in the app imports from it
// anymore. Safe to delete.
export {};
