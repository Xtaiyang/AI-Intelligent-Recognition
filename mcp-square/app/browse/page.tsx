import type { Metadata } from 'next';

import { BrowseClient } from '@/app/browse/BrowseClient';

export const metadata: Metadata = {
  title: 'Browse',
};

type BrowsePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  const initialCategoryRaw = searchParams?.category;
  const initialQueryRaw = searchParams?.q;

  const initialCategory = Array.isArray(initialCategoryRaw)
    ? initialCategoryRaw[0] ?? ''
    : initialCategoryRaw ?? '';

  const initialQuery = Array.isArray(initialQueryRaw)
    ? initialQueryRaw[0] ?? ''
    : initialQueryRaw ?? '';

  return <BrowseClient initialCategory={initialCategory} initialQuery={initialQuery} />;
}
