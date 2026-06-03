import { neon } from "@neondatabase/serverless";

/**
 * Returns a tagged-template SQL executor connected to Neon.
 * Reuses the same connection string across all calls.
 *
 * Usage:
 *   const sql = getDb();
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  return neon(process.env.DATABASE_URL);
}
