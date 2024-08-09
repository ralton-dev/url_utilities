import { urlSchema } from '@/validation/url'
import { urls } from '@/db/schema'
import { customAlphabet } from 'nanoid'
import { db } from '@/clients/db'
import { env } from '@/env.mjs'
import { eq } from 'drizzle-orm'

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 10)
const redirectPage = `${env.APP_URL}/r`

export async function POST(request: Request) {
  if (request.headers.get('x-api-key') !== env.API_KEY) {
    return Response.json(
      {
        success: false,
        errors: ['Unauthorized'],
      },
      { status: 401 }
    )
  }

  const body = await request.json()

  const validated = urlSchema.safeParse(body)
  if (!validated.success) {
    return Response.json(
      {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const {
    data: { url },
  } = validated

  try {
    const result = await db
      .select({
        alias: urls.alias,
      })
      .from(urls)
      .where(eq(urls.url, url))
      .limit(1)

    // If the url already exists, return the existing alias
    if (result.length > 0) {
      const { alias } = result[0]

      return Response.json({
        success: true,
        url: `${redirectPage}/${alias}`,
      })
    }

    const alias = nanoid()
    await db.insert(urls).values([
      {
        url,
        alias,
      },
    ])

    return Response.json({
      success: true,
      url: `${redirectPage}/${alias}`,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        errors: ['Error creating url'],
      },
      { status: 422 }
    )
  }
}
