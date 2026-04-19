# URL Utilities

A lightweight URL shortener with QR code generation, built on Next.js 14 (App Router), Drizzle ORM, and Postgres.

- `POST /api/url` — shorten a URL and return an alias
- `POST /api/qr` — shorten a URL and return a data-URL QR code
- `GET /r/:alias` — redirect to the original URL and increment the visit counter

## Requirements

- Node.js 18+
- Postgres (local, Supabase, Neon, or any hosted Postgres)
- A stable hostname for deployment — shortened links embed `APP_URL`, so it shouldn't change

## Quick Start

```bash
git clone https://github.com/ralton-dev/url-utilities.git
cd url-utilities
npm install
cp .env.example .env.local
# edit .env.local and fill in the three variables below
npm run drizzle-kit:push   # apply schema to your database
npm run dev                # http://localhost:3000
```

## Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable       | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `POSTGRES_URL` | Postgres connection string (e.g. `postgres://user:pass@host:5432/db`)                |
| `API_KEY`      | Shared secret required in the `x-api-key` header for `/api/url` and `/api/qr`        |
| `APP_URL`      | Public URL of this app (no trailing slash), used to build returned shortened links   |

## Database

Schema lives in `src/db/schema.ts`. Drizzle manages migrations under `src/db/migrations/`.

```bash
npm run drizzle-kit:push      # push schema changes to the DB
npm run drizzle-kit:migrate   # introspect existing DB into schema
npm run drizzle-kit:studio    # open Drizzle Studio
```

### Supabase users

If your Postgres provider requires a custom CA (e.g. Supabase), drop the cert into `.supabase/` and prefix the drizzle commands with `NODE_EXTRA_CA_CERTS`:

```bash
NODE_EXTRA_CA_CERTS=./.supabase/prod-ca-2021.crt npm run drizzle-kit:push
```

## API

All write endpoints require the `x-api-key` header to match `API_KEY`.

### Shorten a URL

```bash
curl -X POST "$APP_URL/api/url" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"url": "https://example.com/some/very/long/path"}'
```

Response:

```json
{ "success": true, "url": "https://your-app.example/r/abc123" }
```

### Shorten a URL and get a QR code

```bash
curl -X POST "$APP_URL/api/qr" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"url": "https://example.com"}'
```

Response includes a base64 `qrCode` data URL (high error-correction, PNG).

### Follow a short link

`GET /r/:alias` → 301 redirect to the original URL. Each hit increments `count` in the database.

## Deployment

Any platform that runs Next.js works. Vercel is the path of least resistance — set the three environment variables in the project settings and deploy. The app needs outbound access to your Postgres host.

## Scripts

| Script                         | What it does                              |
| ------------------------------ | ----------------------------------------- |
| `npm run dev`                  | Start the Next.js dev server              |
| `npm run build` / `npm start`  | Production build and serve                |
| `npm run lint`                 | Next.js ESLint                            |
| `npm run format` / `format:fix`| Prettier check / write                    |

## License

MIT — see [LICENSE](./LICENSE).
