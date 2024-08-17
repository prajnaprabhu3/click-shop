import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sql = neon(process.env.POSTGRES_DB_URL as string);

export const db = drizzle(sql);
