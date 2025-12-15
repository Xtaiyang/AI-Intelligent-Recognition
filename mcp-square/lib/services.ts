import type { Service } from '@/types/service';

const SERVICES: Service[] = [
  {
    id: 'image-recognition',
    name: 'Image Recognition',
    description: 'Identify objects and scenes from images.',
    category: 'AI',
    status: 'active',
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Automated safety checks for text and images.',
    category: 'Safety',
    status: 'active',
  },
  {
    id: 'catalog-enrichment',
    name: 'Catalog Enrichment',
    description: 'Normalize titles, tags, and attributes for listings.',
    category: 'Data',
    status: 'draft',
  },
];

export function listServices(): Service[] {
  return SERVICES;
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
