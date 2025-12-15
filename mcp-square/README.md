# mcp-square (Next.js 14)

## Setup

```bash
cd mcp-square
npm install
npm run dev
```

App will be available at http://localhost:3000.

## Routes

- `/browse` — public service listing
- `/services/[id]` — public service detail page (full MCP info + contact CTA + related services)
- `/admin/services` — admin CRUD UI (demo auth guard + optimistic updates)

### Demo admin guard

The admin area uses a **fake role guard** for now.

- Click **“Enter admin (demo)”** on the page, or
- Visit `/admin/services?as=admin`

This is only a placeholder for future real authentication/authorization.

## API

- `GET /api/services` — list services
- `POST /api/services` — create service
- `GET /api/services/[id]` — get service
- `PUT /api/services/[id]` — update service
- `DELETE /api/services/[id]` — delete service

Currently these endpoints use an in-memory store to support UI development.

## Build / start

```bash
cd mcp-square
npm run build
npm run start
```

## Environment variables

Create `mcp-square/.env.local` (see `.env.example`).

Required:

- `MONGODB_URI` — MongoDB connection string (used by server-side data layer; required once DB-backed features are enabled).
- `NEXT_PUBLIC_SITE_URL` — Public base URL (used for metadata / canonical URL generation).

## Database Schema

### MCP Service

Fields:
- `title`: String (Required)
- `summary`: String (Required)
- `category`: String (Required)
- `tags`: Array of Strings
- `pricing`: String (Default: 'Free')
- `status`: 'active' | 'draft' | 'archived' (Default: 'draft')
- `contactInfo`: String
- `createdAt`: Date
- `updatedAt`: Date

## Scripts

- `npm run seed:mcp`: Seeding the database with example MCP services.
