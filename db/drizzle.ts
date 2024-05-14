import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(process.env.DATABASE_URL!);
// const sql = neon(
//   "postgresql://lingo_owner:PKFv2i0QbOHg@ep-old-wind-a5hu91kj.us-east-2.aws.neon.tech/lingo?sslmode=require"
// );
const db = drizzle(sql, { schema });

export default db;
