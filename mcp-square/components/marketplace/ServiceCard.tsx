'use client';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import type { Service } from '@/types/service';

type ServiceCardProps = {
  service: Service;
  label?: string;
  showStatus?: boolean;
};

export function ServiceCard({ service, label, showStatus = false }: ServiceCardProps) {
  return (
    <Card>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CardTitle style={{ marginBottom: 0 }}>{service.name}</CardTitle>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          {label ? <Badge>{label}</Badge> : null}
          <Badge>{service.category}</Badge>
          {showStatus ? <Badge>{service.status}</Badge> : null}
        </div>
      </div>

      <div style={{ height: 10 }} />
      <CardDescription>{service.description}</CardDescription>

      <div style={{ height: 14 }} />
      <div className="row">
        <ButtonLink href={`/services/${service.id}`} variant="primary">
          View details
        </ButtonLink>
      </div>
    </Card>
  );
}
