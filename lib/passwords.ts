// Node's built-in crypto (scrypt) — no extra dependency needed. This file
// is only ever imported by Node-runtime code (API routes), never by
// middleware, so it's fine to use Node-only APIs here (unlike lib/auth.ts,
// which also runs in the Edge middleware and sticks to Web Crypto).
import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = crypto.scryptSync(password, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, testBuf);
}
