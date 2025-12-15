import {
  successResponse,
  createdResponse,
  errorResponse,
  handleZodError,
  handleMongoError,
  parseQueryParams,
  parseRequestBody,
  getPaginationParams,
  buildServiceFilter,
} from '@/lib/api-utils';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';

// Mock NextRequest for testing
function createMockRequest(url: string, body?: any) {
  return {
    nextUrl: new URL(url),
    json: async () => body,
  } as unknown as NextRequest;
}

describe('API Utilities', () => {
  describe('Response Helpers', () => {
    it('should create success response with custom status', () => {
      const data = { message: 'Success' };
      const response = successResponse(data, 200, 'Custom message');
      
      expect(response.status).toBe(200);
    });

    it('should create created response', () => {
      const data = { id: '123', name: 'Created Item' };
      const response = createdResponse(data, 'Created successfully');
      
      expect(response.status).toBe(201);
    });

    it('should create error response', () => {
      const response = errorResponse('Error message', 400, 'CUSTOM_ERROR');
      
      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should create default error response', () => {
      const response = errorResponse('Error message', 500);
      
      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('Error Handlers', () => {
    it('should handle Zod validation errors', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['title'],
          message: 'Expected string, received number',
        },
      ]);

      const response = handleZodError(zodError);
      const data = response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.details.title).toBe('Expected string, received number');
    });

    it('should handle MongoDB duplicate key errors', () => {
      const mongoError = {
        code: 11000,
        keyPattern: { title: 1 },
        message: 'E11000 duplicate key error',
      };

      const response = handleMongoError(mongoError);
      const data = response.json();

      expect(response.status).toBe(409);
      expect(data.error.code).toBe('DUPLICATE_ERROR');
      expect(data.error.message).toContain('title already exists');
    });

    it('should handle MongoDB validation errors', () => {
      const mongoError = {
        name: 'ValidationError',
        errors: {
          title: { message: 'Title is required' },
          category: { message: 'Category is required' },
        },
      };

      const response = handleMongoError(mongoError);
      const data = response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Query Parameter Parsing', () => {
    it('should parse valid query parameters', () => {
      const request = createMockRequest('http://localhost:3000/api/services?page=1&limit=10&category=AI');
      
      const { data, error } = parseQueryParams(request, {
        parse: (params: Record<string, string>) => ({
          page: parseInt(params.page) || 1,
          limit: parseInt(params.limit) || 10,
          category: params.category,
        }),
      });

      expect(error).toBeNull();
      expect(data?.page).toBe(1);
      expect(data?.limit).toBe(10);
      expect(data?.category).toBe('AI');
    });

    it('should return error for invalid query parameters', () => {
      const request = createMockRequest('http://localhost:3000/api/services?page=invalid');

      const { data, error } = parseQueryParams(request, {
        parse: (params: Record<string, string>) => {
          throw new Error('Invalid parameter');
        },
      });

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(400);
    });
  });

  describe('Request Body Parsing', () => {
    it('should parse valid JSON body', async () => {
      const request = createMockRequest('http://localhost:3000/api/services', {
        title: 'Test Service',
        summary: 'Test summary',
        category: 'Test Category',
      });

      const { data, error } = await parseRequestBody(request, {
        parse: (body: any) => body,
      });

      expect(error).toBeNull();
      expect(data?.title).toBe('Test Service');
    });

    it('should handle invalid JSON body', async () => {
      const request = createMockRequest('http://localhost:3000/api/services', 'invalid json');

      const { data, error } = await parseRequestBody(request, {
        parse: (body: any) => body,
      });

      expect(data).toBeNull();
      expect(error).not.toBeNull();
    });
  });

  describe('Pagination Helpers', () => {
    it('should calculate correct pagination parameters', () => {
      const params = getPaginationParams(2, 10);
      
      expect(params.skip).toBe(10);
      expect(params.take).toBe(10);
      expect(params.page).toBe(2);
      expect(params.limit).toBe(10);
    });

    it('should use defaults when no parameters provided', () => {
      const params = getPaginationParams();
      
      expect(params.skip).toBe(0);
      expect(params.take).toBe(10);
      expect(params.page).toBe(1);
      expect(params.limit).toBe(10);
    });
  });

  describe('Filter Building', () => {
    it('should build empty filter when no parameters provided', () => {
      const filter = buildServiceFilter();
      
      expect(filter).toEqual({});
    });

    it('should build filter with category', () => {
      const filter = buildServiceFilter('AI');
      
      expect(filter).toEqual({ category: 'AI' });
    });

    it('should build filter with search', () => {
      const filter = buildServiceFilter(undefined, 'test');
      
      expect(filter).toHaveProperty('$or');
      expect(Array.isArray(filter.$or)).toBe(true);
    });

    it('should build filter with category and search', () => {
      const filter = buildServiceFilter('AI', 'test');
      
      expect(filter).toEqual({
        category: 'AI',
        $or: expect.arrayContaining([
          expect.objectContaining({ title: expect.any(Object) }),
        ]),
      });
    });
  });
});