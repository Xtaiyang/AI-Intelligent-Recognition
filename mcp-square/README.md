# mcp-square (Next.js 14)

## Setup

```bash
cd mcp-square
npm install
npm run dev
```

App will be available at http://localhost:3000.

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
