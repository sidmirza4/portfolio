import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
