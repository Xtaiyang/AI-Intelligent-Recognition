import type { Metadata } from 'next';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { listServices } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Browse',
};

export const dynamic = 'force-dynamic';

export default function BrowsePage() {
  const services = listServices();

  return (
    <div>
      <h1 className="h1">Browse services</h1>
      <p className="lead">Explore MCP services. Click into any listing to view full details.</p>

      <div className="grid">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <CardTitle style={{ marginBottom: 0 }}>{service.title}</CardTitle>
              <Badge>{service.category}</Badge>
            </div>
            <div style={{ height: 10 }} />
            <CardDescription>{service.summary}</CardDescription>
            <div style={{ height: 12 }} />
            <div className="row">
              <ButtonLink href={`/services/${service.id}`} variant="primary">
                Details
              </ButtonLink>
              <ButtonLink href="/admin/services">Manage</ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
