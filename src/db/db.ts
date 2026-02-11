import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "./schemas/schema"
import { DATABASE_URL } from '../../constants';

const sql = neon(DATABASE_URL!);
export const db = drizzle(sql, {schema});