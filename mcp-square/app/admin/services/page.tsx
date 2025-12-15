import type { Metadata } from 'next';

import { FakeAdminGuard } from '@/components/auth/FakeAdminGuard';

import { AdminServicesClient } from './AdminServicesClient';

export const metadata: Metadata = {
  title: 'Admin · Services',
};

export const dynamic = 'force-dynamic';

export default function AdminServicesPage() {
  return (
    <FakeAdminGuard>
      <AdminServicesClient />
    </FakeAdminGuard>
  );
}
