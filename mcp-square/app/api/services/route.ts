import { NextResponse } from 'next/server';

import { listServices } from '@/lib/services';

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
  const category = url.searchParams.get('category')?.trim() ?? '';

  const allServices = listServices();
  const categories = Array.from(new Set(allServices.map((s) => s.category))).sort();

  let services = allServices;

  if (category && category !== 'all') {
    services = services.filter((s) => s.category === category);
  }

  if (q) {
    services = services.filter((s) => {
      const haystack = `${s.name} ${s.description} ${s.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  const total = services.length;

  const pageSizeParam = url.searchParams.get('pageSize');
  const pageParam = url.searchParams.get('page');

  const pageSize = pageSizeParam ? Math.max(1, Number(pageSizeParam)) : null;
  const page = pageParam ? Math.max(1, Number(pageParam)) : 1;

  if (pageSize) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return NextResponse.json({
      services: services.slice(start, start + pageSize),
      total,
      page: safePage,
      pageSize,
      totalPages,
      categories,
    });
  }

  return NextResponse.json({ services, total, categories });
}
