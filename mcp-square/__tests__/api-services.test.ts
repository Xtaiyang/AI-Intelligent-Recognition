import { GET, POST } from '@/app/api/services/route';
import { 
  setupTestEnvironment, 
  createTestServiceData,
  createMockServiceDocument 
} from './test-utils';
import McpService from '@/lib/models/McpService';
import { NextRequest } from 'next/server';

// Setup test environment
setupTestEnvironment();

// Mock NextRequest
function createMockRequest(url: string, options: RequestInit = {}) {
  return {
    method: options.method || 'GET',
    url,
    nextUrl: new URL(url),
    headers: new Headers(options.headers),
    json: async () => options.body ? JSON.parse(options.body as string) : {},
  } as unknown as NextRequest;
}

describe('Services API Routes', () => {
  describe('GET /api/services', () => {
    it('should return paginated services list', async () => {
      // Create test services
      const service1 = await McpService.create(createTestServiceData({ title: 'Service 1' }));
      const service2 = await McpService.create(createTestServiceData({ title: 'Service 2' }));

      const request = createMockRequest('http://localhost:3000/api/services?page=1&limit=10');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.services).toHaveLength(2);
      expect(data.data.pagination.currentPage).toBe(1);
      expect(data.data.pagination.totalCount).toBe(2);
    });

    it('should filter services by category', async () => {
      await McpService.create(createTestServiceData({ title: 'AI Service', category: 'AI' }));
      await McpService.create(createTestServiceData({ title: 'Data Service', category: 'Data' }));

      const request = createMockRequest('http://localhost:3000/api/services?category=AI');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.services).toHaveLength(1);
      expect(data.data.services[0].category).toBe('AI');
    });

    it('should search services by keyword', async () => {
      await McpService.create(createTestServiceData({ 
        title: 'Image Recognition Service',
        summary: 'Advanced image recognition using AI'
      }));
      await McpService.create(createTestServiceData({ 
        title: 'Data Processing Service',
        summary: 'Data processing and analytics'
      }));

      const request = createMockRequest('http://localhost:3000/api/services?search=image');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.services).toHaveLength(1);
      expect(data.data.services[0].title).toContain('Image Recognition');
    });

    it('should handle invalid query parameters', async () => {
      const request = createMockRequest('http://localhost:3000/api/services?page=invalid');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return empty array when no services found', async () => {
      const request = createMockRequest('http://localhost:3000/api/services');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.services).toHaveLength(0);
      expect(data.data.pagination.totalCount).toBe(0);
    });
  });

  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      const serviceData = createTestServiceData({
        title: 'New Service',
        summary: 'A newly created service',
        category: 'AI'
      });

      const request = createMockRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.title).toBe(serviceData.title);
      expect(data.data.summary).toBe(serviceData.summary);
      expect(data.data.category).toBe(serviceData.category);
      expect(data.data._id).toBeDefined();
    });

    it('should create a service with minimal required fields', async () => {
      const serviceData = {
        title: 'Minimal Service',
        summary: 'A minimal service description',
        category: 'Test'
      };

      const request = createMockRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.title).toBe('Minimal Service');
      expect(data.data.tags).toEqual([]);
      expect(data.data.pricing).toBe('Free');
      expect(data.data.status).toBe('draft');
      expect(data.data.contactInfo).toBe('');
    });

    it('should reject creation with invalid status', async () => {
      const serviceData = {
        title: 'Invalid Service',
        summary: 'Service with invalid status',
        category: 'Test',
        status: 'invalid-status'
      };

      const request = createMockRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject creation with empty title', async () => {
      const serviceData = {
        title: '',
        summary: 'Service with empty title',
        category: 'Test'
      };

      const request = createMockRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject creation with invalid JSON', async () => {
      const request = createMockRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });
});