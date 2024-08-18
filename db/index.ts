import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL as string);

export const db = drizzle(sql, { schema });
