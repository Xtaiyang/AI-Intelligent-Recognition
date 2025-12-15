import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

// Standard API response helper
export function createResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): Response {
  return new Response(
    JSON.stringify({
      data,
      message,
      status,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Success responses
export function successResponse<T>(data: T, status: number = 200, message?: string) {
  return createResponse(data, status, message);
}

export function createdResponse<T>(data: T, message?: string) {
  return createResponse(data, 201, message);
}

// Error response helper
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: Record<string, any>
): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: code || getErrorCode(status),
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Map HTTP status codes to error codes
function getErrorCode(status: number): string {
  const errorCodes: Record<number, string> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    500: 'INTERNAL_ERROR',
  };

  return errorCodes[status] || 'UNKNOWN_ERROR';
}

// Handle Zod validation errors
export function handleZodError(error: ZodError): Response {
  const formattedErrors = error.errors.reduce((acc, err) => {
    const path = err.path.join('.');
    acc[path] = err.message;
    return acc;
  }, {} as Record<string, string>);

  return errorResponse(
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    formattedErrors
  );
}

// Handle MongoDB errors
export function handleMongoError(error: any): Response {
  // Handle duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return errorResponse(
      `${field} already exists`,
      409,
      'DUPLICATE_ERROR',
      { field }
    );
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors)
      .map((err: any) => err.message)
      .join(', ');
    return errorResponse(message, 400, 'VALIDATION_ERROR');
  }

  // Handle cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    return errorResponse('Invalid ID format', 400, 'INVALID_ID');
  }

  // Default to internal error
  return errorResponse('Database operation failed', 500, 'DATABASE_ERROR');
}

// Parse and validate query parameters
export function parseQueryParams<T>(
  request: NextRequest,
  schema: any
): { data: T | null; error: Response | null } {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryObject: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      queryObject[key] = value;
    });

    const data = schema.parse(queryObject);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: handleZodError(error) };
    }
    return { data: null, error: errorResponse('Invalid query parameters', 400) };
  }
}

// Parse JSON body with error handling
export async function parseRequestBody<T>(
  request: NextRequest,
  schema: any
): Promise<{ data: T | null; error: Response | null }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: handleZodError(error) };
    }
    if (error instanceof SyntaxError) {
      return { data: null, error: errorResponse('Invalid JSON', 400) };
    }
    return { data: null, error: errorResponse('Invalid request body', 400) };
  }
}

// Extract pagination parameters
export function getPaginationParams(
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
}

// Build filter query for MongoDB
export function buildServiceFilter(
  category?: string,
  search?: string
): Record<string, any> {
  const filter: Record<string, any> = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  return filter;
}