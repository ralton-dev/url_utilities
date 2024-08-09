import { db } from '@/clients/db'
import { urls } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(
  request: Request,
  { params }: { params: { alias: string } }
) {
  const { alias } = params

  const result = await db
    .select({
      url: urls.url,
      count: urls.count,
    })
    .from(urls)
    .where(eq(urls.alias, alias))
    .limit(1)

  if (result.length > 0) {
    const { url, count } = result[0]
    await db
      .update(urls)
      .set({ count: count! + 1 })
      .where(eq(urls.alias, alias))

    return Response.redirect(url!, 301)
  } else {
    return new Response('Not found', { status: 404 })
  }
}
