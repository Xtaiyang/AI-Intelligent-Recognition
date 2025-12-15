'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { CategoryChips } from '@/components/marketplace/CategoryChips';
import { Pagination } from '@/components/marketplace/Pagination';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Service } from '@/types/service';

type BrowseClientProps = {
  initialQuery?: string;
  initialCategory?: string;
};

type LoadState = 'loading' | 'success' | 'error';

const PAGE_SIZE = 9;

function BrowseSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <div className="toolbar">
        <div className="input skeleton" style={{ width: 320 }} />
        <div className="chips">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="chip skeleton" style={{ width: 90 }} />
          ))}
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="grid" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="skeleton" style={{ minHeight: 128 }} />
        ))}
      </div>
    </div>
  );
}

export function BrowseClient({ initialQuery = '', initialCategory = '' }: BrowseClientProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoadState('loading');

    try {
      const res = await fetch('/api/services', { signal });
      if (!res.ok) throw new Error('Failed to load services');

      const data = (await res.json()) as { services: Service[] };
      setServices(data.services);
      setLoadState('success');
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return;
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const categories = useMemo(() => {
    return Array.from(new Set(services.map((s) => s.category))).sort();
  }, [services]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      if (category && service.category !== category) return false;

      if (!normalizedQuery) return true;

      const haystack = `${service.name} ${service.description} ${service.category}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [services, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  const pageServices = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, totalPages]);

  return (
    <div>
      <h1 className="h1">Browse services</h1>
      <p className="lead">Search and filter MCP services, then open a listing to view details.</p>

      {loadState === 'loading' ? <BrowseSkeleton /> : null}

      {loadState === 'error' ? (
        <EmptyState
          title="Could not load services"
          description="Please check your connection and try again."
          action={
            <div className="row">
              <Button type="button" onClick={() => void load()} variant="primary">
                Retry
              </Button>
            </div>
          }
        />
      ) : null}

      {loadState === 'success' ? (
        <>
          <div className="toolbar">
            <SearchBar value={query} onChange={setQuery} />
            <CategoryChips categories={categories} value={category} onChange={setCategory} />
          </div>

          <div className="resultsSummary" aria-live="polite">
            Showing <strong>{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}
            {category ? (
              <>
                {' '}
                in <strong>{category}</strong>
              </>
            ) : null}
            {query.trim() ? (
              <>
                {' '}
                for <strong>“{query.trim()}”</strong>
              </>
            ) : null}
            .
          </div>

          <div style={{ height: 12 }} />

          {filtered.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try a different search term or clear your filters."
              action={
                <div className="row">
                  <Button type="button" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                  <Button type="button" onClick={() => setCategory('')}>
                    Clear category
                  </Button>
                </div>
              }
            />
          ) : (
            <>
              <div className="grid" aria-label="Service results">
                {pageServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              <div style={{ height: 16 }} />

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
