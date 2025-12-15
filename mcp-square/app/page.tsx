import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { listServices } from '@/lib/services';

export default function HomePage() {
  const services = listServices().slice(0, 2);

  return (
    <div>
      <h1 className="h1">MCP Square</h1>
      <p className="lead">
        A Next.js 14 starter for building a marketplace of MCP services. This is a scaffold with
        placeholder routes and shared UI primitives.
      </p>

      <div className="row">
        <ButtonLink href="/browse" variant="primary">
          Browse services
        </ButtonLink>
        <ButtonLink href="/admin/services">Admin</ButtonLink>
      </div>

      <div style={{ height: 18 }} />

      <div className="grid">
        {services.map((service) => (
          <Card key={service.id}>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
            <div style={{ height: 12 }} />
            <ButtonLink href={`/services/${service.id}`}>View details</ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
