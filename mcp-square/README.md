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

## API Endpoints

The application provides RESTful API endpoints for managing MCP services at `/api/services`.

### Available Endpoints

- `GET /api/services` - List services with pagination, filtering, and search
- `GET /api/services/{id}` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service (full update)
- `PATCH /api/services/{id}` - Update service (partial update)
- `DELETE /api/services/{id}` - Delete service

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `category` - Filter by category
- `search` - Search in title, summary, category, and tags

### API Documentation

Complete API documentation is available in [`api.md`](api.md).

## Testing

Run tests with Jest:

```bash
npm test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Database Schema

### MCP Service

Fields:
- `title`: String (Required, 1-200 chars)
- `summary`: String (Required, 1-1000 chars)
- `category`: String (Required, 1-100 chars)
- `tags`: Array of Strings
- `pricing`: String (Default: 'Free', max 200 chars)
- `status`: 'active' | 'draft' | 'archived' (Default: 'draft')
- `contactInfo`: String (max 500 chars, default: '')
- `createdAt`: Date
- `updatedAt`: Date

## Scripts

- `npm run seed:mcp`: Seeding the database with example MCP services.
- `npm test`: Run test suite
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage
