import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core'
export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  url: text('url'),
  alias: varchar('alias', { length: 10 }),
  count: integer('count').default(0),
})
