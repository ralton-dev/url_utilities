import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'

dotenv.config({ path: '.env.local' })

if (!process.env.POSTGRES_URL) {
  throw new Error('DATABASE environment variable required.')
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config
