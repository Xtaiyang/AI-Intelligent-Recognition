import { NextResponse } from 'next/server';

import {
  deleteService,
  getServiceById,
  mcpServiceUpdateSchema,
  updateService,
} from '@/lib/services';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: RouteContext) {
  const service = getServiceById(params.id);
  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ service });
}

export async function PUT(req: Request, { params }: RouteContext) {
  const body = await req.json().catch(() => null);
  const parsed = mcpServiceUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation error',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const service = updateService(params.id, parsed.data);
  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ service });
}

export async function PATCH(req: Request, ctx: RouteContext) {
  return PUT(req, ctx);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const ok = deleteService(params.id);
  if (!ok) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
