import type { Metadata } from 'next';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { listServices } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Admin · Services',
};

export default function AdminServicesPage() {
  const services = listServices();

  return (
    <div>
      <h1 className="h1">Admin · Services</h1>
      <p className="lead">
        Placeholder admin page. Replace this with auth, CRUD actions, and database integration.
      </p>

      <div className="row">
        <ButtonLink href="/browse" variant="primary">
          View public browse
        </ButtonLink>
      </div>

      <div style={{ height: 16 }} />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>
                <Badge>{service.category}</Badge>
              </td>
              <td>
                <Badge>{service.status}</Badge>
              </td>
              <td style={{ textAlign: 'right' }}>
                <ButtonLink href={`/services/${service.id}`}>Preview</ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
