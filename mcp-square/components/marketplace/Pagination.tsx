'use client';

import { Button } from '@/components/ui/Button';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getWindowedPages(page: number, totalPages: number) {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);

  const start = Math.max(1, Math.min(page - half, totalPages - windowSize + 1));
  const end = Math.min(totalPages, start + windowSize - 1);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getWindowedPages(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </Button>

      <div className="paginationPages" aria-label="Pages">
        {pages.map((p) => {
          const active = p === page;
          return (
            <Button
              key={p}
              type="button"
              className={active ? 'btnPrimary' : undefined}
              onClick={() => onPageChange(p)}
              aria-current={active ? 'page' : undefined}
              aria-label={active ? `Page ${p}, current page` : `Go to page ${p}`}
            >
              {p}
            </Button>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </Button>
    </nav>
  );
}
