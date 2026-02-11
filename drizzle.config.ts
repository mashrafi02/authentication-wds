import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './constants';

export default defineConfig({
  out: './src/drizzle',
  schema: './src/db/schemas/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
