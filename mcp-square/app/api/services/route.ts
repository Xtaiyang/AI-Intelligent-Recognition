import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createService, listServices, mcpServiceInputSchema } from '@/lib/services';

export const dynamic = 'force-dynamic';

const createSchema = mcpServiceInputSchema.extend({
  id: z.string().trim().min(1).optional(),
});

export async function GET() {
  return NextResponse.json({ services: listServices() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation error',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const service = createService(parsed.data);
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create service' },
      { status: 400 }
    );
  }
}
