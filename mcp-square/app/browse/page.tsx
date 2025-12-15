import type { Metadata } from 'next';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { listServices } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Browse',
};

export default function BrowsePage() {
  const services = listServices();

  return (
    <div>
      <h1 className="h1">Browse services</h1>
      <p className="lead">Placeholder browse page. Replace this with search, filtering, and paging.</p>

      <div className="grid">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <CardTitle style={{ marginBottom: 0 }}>{service.name}</CardTitle>
              <Badge>{service.category}</Badge>
            </div>
            <div style={{ height: 10 }} />
            <CardDescription>{service.description}</CardDescription>
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
