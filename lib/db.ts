import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// This connects to the DATABASE_URL in your .env file
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);