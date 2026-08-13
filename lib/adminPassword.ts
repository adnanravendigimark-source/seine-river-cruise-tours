// Stores an optional hashed-password override for the .env owner account
// in the site_settings table (column: admin_password_hash). When set, the
// login route uses this hash instead of the plain-text ADMIN_PASSWORD env
// var — so the owner can change their password through the UI without
// touching the deployment's env vars.
import { sql } from "./db";
import { hashPassword, verifyPassword } from "./passwords";

/** Returns the stored hash, or null if none has been set yet. */
export async function getAdminPasswordHash(): Promise<string | null> {
  try {
    const rows = await sql`SELECT admin_password_hash FROM site_settings WHERE id = 1 LIMIT 1`;
    const hash = rows[0]?.admin_password_hash as string | null | undefined;
    return hash || null;
  } catch {
    return null;
  }
}

/** Saves a new hashed password for the owner account. */
export async function setAdminPasswordHash(plainPassword: string): Promise<void> {
  const hash = hashPassword(plainPassword);
  await sql`
    INSERT INTO site_settings (id, admin_password_hash)
    VALUES (1, ${hash})
    ON CONFLICT (id) DO UPDATE SET admin_password_hash = EXCLUDED.admin_password_hash
  `;
}

/**
 * Verifies a candidate password against the owner account.
 * Checks the DB hash first; if none is stored, falls back to the plain-text
 * ADMIN_PASSWORD env var (the original behaviour before the owner ever
 * changed their password through the UI).
 */
export async function verifyOwnerPassword(candidate: string): Promise<boolean> {
  const dbHash = await getAdminPasswordHash();
  if (dbHash) {
    return verifyPassword(candidate, dbHash);
  }
  // Fall back: compare directly against the env var (initial setup).
  const envPw = process.env.ADMIN_PASSWORD || "";
  return candidate === envPw;
}
