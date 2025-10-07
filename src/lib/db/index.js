import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

dotenv.config({ path: '.env.local' });

const db = drizzle(process.env.DATABASE_URL);
export default db;
