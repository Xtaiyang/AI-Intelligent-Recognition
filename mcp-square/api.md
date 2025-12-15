# MCP Services API Documentation

This document describes the RESTful API for managing MCP (Model Context Protocol) Services. The API provides endpoints for creating, reading, updating, and deleting services with support for pagination, filtering, and search.

## Base URL

```
http://localhost:3000/api/services
```

## Authentication

Currently, the API does not require authentication. This may be implemented in future versions.

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_ID` | 400 | Invalid MongoDB ObjectId format |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ERROR` | 409 | Resource already exists |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Endpoints

### 1. List Services

Get a paginated list of services with optional filtering and search.

#### Request
```
GET /api/services
```

#### Query Parameters

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `page` | integer | No | Page number (1-based) | 1 |
| `limit` | integer | No | Items per page (1-100) | 10 |
| `category` | string | No | Filter by category | - |
| `search` | string | No | Search in title, summary, category, and tags | - |

#### Example Requests

```bash
# Basic list (first page, 10 items)
GET /api/services

# Specific page and limit
GET /api/services?page=2&limit=20

# Filter by category
GET /api/services?category=AI

# Search services
GET /api/services?search=image

# Combined filtering
GET /api/services?category=AI&search=recognition&page=1&limit=5
```

#### Success Response (200)
```json
{
  "data": {
    "services": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Image Recognition Service",
        "summary": "Advanced image recognition using AI",
        "category": "AI",
        "tags": ["image", "recognition", "ai"],
        "pricing": "Free",
        "status": "active",
        "contactInfo": "contact@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 45,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Services retrieved successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Invalid query parameters
- **500**: Internal server error

### 2. Get Service by ID

Retrieve a specific service by its MongoDB ObjectId.

#### Request
```
GET /api/services/{id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId of the service |

#### Example Request
```bash
GET /api/services/507f1f77bcf86cd799439011
```

#### Success Response (200)
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Image Recognition Service",
    "summary": "Advanced image recognition using AI",
    "category": "AI",
    "tags": ["image", "recognition", "ai"],
    "pricing": "Free",
    "status": "active",
    "contactInfo": "contact@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Service retrieved successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Invalid ObjectId format
- **404**: Service not found
- **500**: Internal server error

### 3. Create Service

Create a new service.

#### Request
```
POST /api/services
```

#### Request Body

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `title` | string | Yes | Service title | 1-200 characters |
| `summary` | string | Yes | Service summary | 1-1000 characters |
| `category` | string | Yes | Service category | 1-100 characters |
| `tags` | array[string] | No | Service tags | Array of non-empty strings |
| `pricing` | string | No | Pricing information | Max 200 characters, default: "Free" |
| `status` | string | No | Service status | Enum: "active", "draft", "archived", default: "draft" |
| `contactInfo` | string | No | Contact information | Max 500 characters, default: "" |

#### Example Request
```bash
POST /api/services
Content-Type: application/json

{
  "title": "Advanced NLP Service",
  "summary": "Natural language processing for text analysis",
  "category": "AI",
  "tags": ["nlp", "text", "analysis"],
  "pricing": "Paid",
  "status": "draft",
  "contactInfo": "nlp@example.com"
}
```

#### Success Response (201)
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Advanced NLP Service",
    "summary": "Natural language processing for text analysis",
    "category": "AI",
    "tags": ["nlp", "text", "analysis"],
    "pricing": "Paid",
    "status": "draft",
    "contactInfo": "nlp@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Service created successfully",
  "status": 201,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Validation error (missing required fields, invalid status, etc.)
- **409**: Duplicate service (same title and category)
- **500**: Internal server error

#### Validation Rules
- `title`, `summary`, and `category` are required
- `status` must be one of: "active", "draft", "archived"
- All string fields have maximum length limits
- Tags array can be empty or contain non-empty strings

### 4. Update Service (Full)

Update all fields of a service.

#### Request
```
PUT /api/services/{id}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId of the service |

#### Request Body
Same as [Create Service](#3-create-service) - all fields optional but validated if provided.

#### Example Request
```bash
PUT /api/services/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "title": "Updated Image Recognition Service",
  "summary": "Updated description with new features",
  "category": "AI",
  "tags": ["image", "recognition", "ai", "updated"],
  "pricing": "Freemium",
  "status": "active",
  "contactInfo": "updated@example.com"
}
```

#### Success Response (200)
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Image Recognition Service",
    "summary": "Updated description with new features",
    "category": "AI",
    "tags": ["image", "recognition", "ai", "updated"],
    "pricing": "Freemium",
    "status": "active",
    "contactInfo": "updated@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Service updated successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Invalid ObjectId format or validation error
- **404**: Service not found
- **409**: Duplicate service (when updating title/category)
- **500**: Internal server error

### 5. Update Service (Partial)

Update specific fields of a service without affecting others.

#### Request
```
PATCH /api/services/{id}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId of the service |

#### Request Body
Any subset of fields from [Create Service](#3-create-service). Only provided fields will be updated.

#### Example Request
```bash
PATCH /api/services/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "active",
  "tags": ["image", "recognition", "ai", "production"]
}
```

#### Success Response (200)
```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Image Recognition Service",
    "summary": "Advanced image recognition using AI",
    "category": "AI",
    "tags": ["image", "recognition", "ai", "production"],
    "pricing": "Free",
    "status": "active",
    "contactInfo": "contact@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Service updated successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Invalid ObjectId format or validation error
- **404**: Service not found
- **500**: Internal server error

### 6. Delete Service

Delete a service permanently.

#### Request
```
DELETE /api/services/{id}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId of the service |

#### Example Request
```bash
DELETE /api/services/507f1f77bcf86cd799439011
```

#### Success Response (200)
```json
{
  "data": {
    "deletedService": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Service to Delete",
      "summary": "Service that will be deleted",
      "category": "Test",
      "tags": ["test"],
      "pricing": "Free",
      "status": "draft",
      "contactInfo": "",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Service deleted successfully",
  "status": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Error Responses
- **400**: Invalid ObjectId format
- **404**: Service not found
- **500**: Internal server error

## Usage Examples

### JavaScript/TypeScript

```typescript
// List services with pagination
const listServices = async (page = 1, limit = 10, category?: string, search?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(category && { category }),
    ...(search && { search }),
  });

  const response = await fetch(`/api/services?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

// Get service by ID
const getService = async (id: string) => {
  const response = await fetch(`/api/services/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

// Create service
const createService = async (serviceData: any) => {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

// Update service (partial)
const updateService = async (id: string, updates: any) => {
  const response = await fetch(`/api/services/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

// Delete service
const deleteService = async (id: string) => {
  const response = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};
```

### cURL

```bash
# List services
curl -X GET "http://localhost:3000/api/services?page=1&limit=10&category=AI"

# Get service by ID
curl -X GET "http://localhost:3000/api/services/507f1f77bcf86cd799439011"

# Create service
curl -X POST "http://localhost:3000/api/services" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Service",
    "summary": "Service description",
    "category": "AI",
    "tags": ["service", "ai"],
    "pricing": "Free",
    "status": "draft"
  }'

# Update service
curl -X PATCH "http://localhost:3000/api/services/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "tags": ["updated", "active"]
  }'

# Delete service
curl -X DELETE "http://localhost:3000/api/services/507f1f77bcf86cd799439011"
```

## Testing

The API includes comprehensive test coverage. Run tests with:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Database Schema

The service data is stored in MongoDB with the following schema:

```typescript
interface IMcpService {
  _id?: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  pricing: string;
  status: 'active' | 'draft' | 'archived';
  contactInfo: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
```

## Best Practices

1. **Validation**: Always validate input data on the client and server
2. **Error Handling**: Implement proper error handling with meaningful messages
3. **Pagination**: Use pagination for large datasets to improve performance
4. **Search**: Use the search parameter for better user experience
5. **Status Management**: Use appropriate service statuses (draft for development, active for production)
6. **Rate Limiting**: Implement rate limiting in production to prevent abuse
7. **Authentication**: Add authentication for sensitive operations in production
8. **Monitoring**: Add logging and monitoring for API endpoints
9. **Documentation**: Keep API documentation updated with changes

## Changelog

### v1.0.0
- Initial implementation of MCP Services API
- Support for CRUD operations
- Pagination, filtering, and search
- Comprehensive error handling
- Input validation with Zod
- Unit and integration tests
- API documentation