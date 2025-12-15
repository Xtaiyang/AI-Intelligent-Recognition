import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { getServiceById } from '@/lib/services';

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getServiceById(params.id);
  if (!service) return { title: 'Service not found' };

  return {
    title: service.name,
    description: service.description,
  };
}

export default function ServiceDetailsPage({ params }: PageProps) {
  const service = getServiceById(params.id);
  if (!service) notFound();

  return (
    <div>
      <h1 className="h1">Service details</h1>
      <p className="lead">Placeholder details route: /services/{service.id}</p>

      <Card>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <CardTitle style={{ marginBottom: 0 }}>{service.name}</CardTitle>
          <Badge>{service.status}</Badge>
        </div>
        <div style={{ height: 10 }} />
        <CardDescription>{service.description}</CardDescription>
        <div style={{ height: 16 }} />
        <div className="row">
          <ButtonLink href="/browse" variant="primary">
            Back to browse
          </ButtonLink>
          <ButtonLink href="/admin/services">Admin</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
