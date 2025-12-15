import { z } from 'zod';

// Base service schema with all common fields
const baseServiceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  summary: z.string().min(1, 'Summary is required').max(1000, 'Summary too long'),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).default([]),
  pricing: z.string().max(200, 'Pricing info too long').default('Free'),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
  contactInfo: z.string().max(500, 'Contact info too long').default(''),
});

// Create service schema (all fields required)
export const createServiceSchema = baseServiceSchema;

// Update service schema (all fields optional for partial updates)
export const updateServiceSchema = baseServiceSchema.partial();

// Query parameters schema for list endpoint
export const serviceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
});

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
});

// Response schemas for consistent API responses
export const serviceResponseSchema = baseServiceSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const servicesListResponseSchema = z.object({
  services: z.array(serviceResponseSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalCount: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
});

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceQuery = z.infer<typeof serviceQuerySchema>;
export type ServiceResponse = z.infer<typeof serviceResponseSchema>;
export type ServicesListResponse = z.infer<typeof servicesListResponseSchema>;