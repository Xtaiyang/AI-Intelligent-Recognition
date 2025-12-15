import { GET, PUT, PATCH, DELETE } from '@/app/api/services/[id]/route';
import { createTestServiceData } from './test-utils';
import McpService from '@/lib/models/McpService';
import { NextRequest } from 'next/server';

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

// Mock params
function createMockParams(id: string) {
  return { params: { id } };
}

describe('Individual Service API Routes', () => {
  describe('GET /api/services/[id]', () => {
    it('should return a specific service by ID', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData({
        title: 'Specific Service',
        summary: 'A specific test service',
        category: 'AI'
      }));

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`);
      const params = createMockParams(service._id);

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe('Specific Service');
      expect(data.data.category).toBe('AI');
      expect(data.data._id).toBe(service._id.toString());
    });

    it('should return 404 for non-existent service ID', async () => {
      const nonExistentId = '507f1f77bcf86cd799439012';
      
      const request = createMockRequest(`http://localhost:3000/api/services/${nonExistentId}`);
      const params = createMockParams(nonExistentId);

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe('NOT_FOUND');
      expect(data.error.message).toBe('Service not found');
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const invalidId = 'invalid-object-id';
      
      const request = createMockRequest(`http://localhost:3000/api/services/${invalidId}`);
      const params = createMockParams(invalidId);

      const response = await GET(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/services/[id]', () => {
    it('should update a service with full data', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData({
        title: 'Original Service',
        summary: 'Original summary',
        category: 'Original Category'
      }));

      const updateData = {
        title: 'Updated Service',
        summary: 'Updated summary',
        category: 'Updated Category',
        status: 'active' as const
      };

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const params = createMockParams(service._id);

      const response = await PUT(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe('Updated Service');
      expect(data.data.summary).toBe('Updated summary');
      expect(data.data.category).toBe('Updated Category');
      expect(data.data.status).toBe('active');
    });

    it('should return 404 for non-existent service ID', async () => {
      const nonExistentId = '507f1f77bcf86cd799439012';
      
      const updateData = createTestServiceData();
      const request = createMockRequest(`http://localhost:3000/api/services/${nonExistentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const params = createMockParams(nonExistentId);

      const response = await PUT(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should reject update with invalid status', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData());

      const updateData = {
        ...createTestServiceData(),
        status: 'invalid-status'
      };

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const params = createMockParams(service._id);

      const response = await PUT(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /api/services/[id]', () => {
    it('should partially update a service', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData({
        title: 'Original Service',
        summary: 'Original summary',
        category: 'Original Category'
      }));

      const updateData = {
        title: 'Partially Updated Service'
      };

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      const params = createMockParams(service._id);

      const response = await PATCH(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe('Partially Updated Service');
      expect(data.data.summary).toBe('Original summary');
      expect(data.data.category).toBe('Original Category');
    });

    it('should update only provided fields', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData({
        title: 'Original Service',
        summary: 'Original summary',
        category: 'Original Category',
        status: 'draft'
      }));

      const updateData = {
        status: 'active' as const
      };

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      const params = createMockParams(service._id);

      const response = await PATCH(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.title).toBe('Original Service');
      expect(data.data.status).toBe('active');
    });
  });

  describe('DELETE /api/services/[id]', () => {
    it('should delete a service', async () => {
      // Create a test service
      const service = await McpService.create(createTestServiceData({
        title: 'Service to Delete',
        summary: 'This service will be deleted',
        category: 'Test'
      }));

      const request = createMockRequest(`http://localhost:3000/api/services/${service._id}`, {
        method: 'DELETE',
      });
      const params = createMockParams(service._id);

      const response = await DELETE(request, params);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.deletedService.title).toBe('Service to Delete');
      
      // Verify the service was actually deleted
      const deletedService = await McpService.findById(service._id);
      expect(deletedService).toBeNull();
    });

    it('should return 404 for non-existent service ID', async () => {
      const nonExistentId = '507f1f77bcf86cd799439012';
      
      const request = createMockRequest(`http://localhost:3000/api/services/${nonExistentId}`, {
        method: 'DELETE',
      });
      const params = createMockParams(nonExistentId);

      const response = await DELETE(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });
});