import 'server-only';

import { z } from 'zod';

import type { McpServiceDto } from '@/types/McpServiceDto';

export const mcpServiceInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  pricing: z.string().optional().default('Free'),
  status: z.enum(['active', 'draft', 'archived']).optional().default('draft'),
  contactInfo: z.string().optional().default(''),
});

export type McpServiceInput = z.infer<typeof mcpServiceInputSchema>;

export const mcpServiceUpdateSchema = mcpServiceInputSchema.partial();

declare global {
  // eslint-disable-next-line no-var
  var __mcpServicesStore: McpServiceDto[] | undefined;
}

function normalizeTags(tags: string[]) {
  const cleaned = tags
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
  return Array.from(new Set(cleaned));
}

function seedStore(): McpServiceDto[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'image-recognition',
      title: 'Image Recognition',
      summary: 'Identify objects and scenes from images.',
      category: 'AI',
      tags: ['image', 'vision', 'ai'],
      pricing: 'Usage based',
      status: 'active',
      contactInfo: 'support@example.com',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'content-moderation',
      title: 'Content Moderation',
      summary: 'Automated safety checks for text and images.',
      category: 'Safety',
      tags: ['moderation', 'safety', 'ai'],
      pricing: 'Monthly subscription',
      status: 'active',
      contactInfo: 'safety@example.com',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'catalog-enrichment',
      title: 'Catalog Enrichment',
      summary: 'Normalize titles, tags, and attributes for listings.',
      category: 'Data',
      tags: ['data', 'ecommerce', 'catalog'],
      pricing: 'Contact us',
      status: 'draft',
      contactInfo: 'sales@example.com',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getStore() {
  if (!global.__mcpServicesStore) {
    global.__mcpServicesStore = seedStore();
  }
  return global.__mcpServicesStore;
}

export function listServices(): McpServiceDto[] {
  return getStore().slice().sort((a, b) => a.title.localeCompare(b.title));
}

export function getServiceById(id: string): McpServiceDto | undefined {
  return getStore().find((s) => s.id === id);
}

export function createService(input: McpServiceInput & { id?: string }): McpServiceDto {
  const parsed = mcpServiceInputSchema.parse(input);

  const now = new Date().toISOString();
  const id = input.id?.trim() || `svc_${Date.now().toString(36)}`;

  const service: McpServiceDto = {
    id,
    ...parsed,
    tags: normalizeTags(parsed.tags),
    createdAt: now,
    updatedAt: now,
  };

  const store = getStore();
  if (store.some((s) => s.id === service.id)) {
    throw new Error('A service with this id already exists');
  }
  store.push(service);
  return service;
}

export function updateService(id: string, update: Partial<McpServiceInput>): McpServiceDto | undefined {
  const store = getStore();
  const index = store.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  const parsed = mcpServiceUpdateSchema.parse(update);

  const next: McpServiceDto = {
    ...store[index],
    ...parsed,
    tags: parsed.tags ? normalizeTags(parsed.tags) : store[index].tags,
    updatedAt: new Date().toISOString(),
  };

  store[index] = next;
  return next;
}

export function deleteService(id: string): boolean {
  const store = getStore();
  const index = store.findIndex((s) => s.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

export function getRelatedServices(service: McpServiceDto, limit = 3): McpServiceDto[] {
  const others = listServices().filter((s) => s.id !== service.id);

  const byCategory = others.filter((s) => s.category === service.category);
  const tagSet = new Set(service.tags);

  const byTags = others.filter((s) => s.tags.some((t) => tagSet.has(t)));

  const combined: McpServiceDto[] = [];
  for (const s of [...byCategory, ...byTags]) {
    if (!combined.some((x) => x.id === s.id)) combined.push(s);
    if (combined.length >= limit) break;
  }

  return combined;
}
