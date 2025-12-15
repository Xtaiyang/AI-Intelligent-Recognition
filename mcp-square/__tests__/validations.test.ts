import {
  createServiceSchema,
  updateServiceSchema,
  serviceQuerySchema,
  idParamSchema,
} from '@/lib/validations/service';

describe('Service Validation Schemas', () => {
  describe('createServiceSchema', () => {
    it('should validate valid service data', () => {
      const validData = {
        title: 'Test Service',
        summary: 'A test service summary',
        category: 'Test Category',
        tags: ['test', 'service'],
        pricing: 'Free',
        status: 'draft',
        contactInfo: 'test@example.com',
      };

      expect(() => createServiceSchema.parse(validData)).not.toThrow();
    });

    it('should require title field', () => {
      const invalidData = {
        summary: 'A test service summary',
        category: 'Test Category',
      };

      expect(() => createServiceSchema.parse(invalidData)).toThrow();
    });

    it('should require summary field', () => {
      const invalidData = {
        title: 'Test Service',
        category: 'Test Category',
      };

      expect(() => createServiceSchema.parse(invalidData)).toThrow();
    });

    it('should require category field', () => {
      const invalidData = {
        title: 'Test Service',
        summary: 'A test service summary',
      };

      expect(() => createServiceSchema.parse(invalidData)).toThrow();
    });

    it('should validate status enum', () => {
      const validStatuses = ['active', 'draft', 'archived'];
      
      validStatuses.forEach(status => {
        const validData = {
          title: 'Test Service',
          summary: 'A test service summary',
          category: 'Test Category',
          status,
        };

        expect(() => createServiceSchema.parse(validData)).not.toThrow();
      });

      expect(() => createServiceSchema.parse({
        title: 'Test Service',
        summary: 'A test service summary',
        category: 'Test Category',
        status: 'invalid-status',
      })).toThrow();
    });

    it('should set default values for optional fields', () => {
      const minimalData = {
        title: 'Test Service',
        summary: 'A test service summary',
        category: 'Test Category',
      };

      const result = createServiceSchema.parse(minimalData);
      
      expect(result.tags).toEqual([]);
      expect(result.pricing).toBe('Free');
      expect(result.status).toBe('draft');
      expect(result.contactInfo).toBe('');
    });
  });

  describe('updateServiceSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        title: 'Updated Service',
      };

      expect(() => updateServiceSchema.parse(partialUpdate)).not.toThrow();
    });

    it('should allow empty objects for PATCH operations', () => {
      const emptyUpdate = {};

      expect(() => updateServiceSchema.parse(emptyUpdate)).not.toThrow();
    });
  });

  describe('serviceQuerySchema', () => {
    it('should parse valid query parameters', () => {
      const query = {
        page: '1',
        limit: '10',
        category: 'AI',
        search: 'test',
      };

      const result = serviceQuerySchema.parse(query);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.category).toBe('AI');
      expect(result.search).toBe('test');
    });

    it('should set default values', () => {
      const emptyQuery = {};

      const result = serviceQuerySchema.parse(emptyQuery);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.category).toBeUndefined();
      expect(result.search).toBeUndefined();
    });

    it('should validate page and limit ranges', () => {
      expect(() => serviceQuerySchema.parse({ page: '0' })).toThrow();
      expect(() => serviceQuerySchema.parse({ limit: '0' })).toThrow();
      expect(() => serviceQuerySchema.parse({ limit: '101' })).toThrow();
      
      expect(() => serviceQuerySchema.parse({ page: '1' })).not.toThrow();
      expect(() => serviceQuerySchema.parse({ limit: '100' })).not.toThrow();
    });
  });

  describe('idParamSchema', () => {
    it('should validate valid MongoDB ObjectId', () => {
      const validId = '507f1f77bcf86cd799439011';

      expect(() => idParamSchema.parse({ id: validId })).not.toThrow();
    });

    it('should reject invalid ObjectId format', () => {
      const invalidId = 'invalid-id';

      expect(() => idParamSchema.parse({ id: invalidId })).toThrow();
    });
  });
});