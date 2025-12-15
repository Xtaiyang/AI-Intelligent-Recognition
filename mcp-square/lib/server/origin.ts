import 'server-only';

import { headers } from 'next/headers';

import { getSiteUrl } from '@/lib/site';

export function getRequestOrigin(): string {
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (envOrigin) return envOrigin;

  const h = headers();

  const forwardedProto = h.get('x-forwarded-proto');
  const proto = forwardedProto ?? 'http';

  const forwardedHost = h.get('x-forwarded-host');
  const host = forwardedHost ?? h.get('host');

  if (host) {
    return `${proto}://${host}`;
  }

  return getSiteUrl();
}
