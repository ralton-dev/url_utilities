import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.js';

export const client = postgres(env.POSTGRES_URL, { max: env.POSTGRES_POOL_MAX });

export const db = drizzle(client);
