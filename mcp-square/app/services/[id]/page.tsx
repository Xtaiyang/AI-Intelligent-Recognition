import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { getRelatedServices, getServiceById } from '@/lib/services';

type PageProps = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';

function formatDate(value?: string | Date) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function getContactHref(contactInfo: string) {
  const contact = contactInfo.trim();
  if (!contact) return null;

  if (contact.startsWith('mailto:') || contact.startsWith('http://') || contact.startsWith('https://')) {
    return contact;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return `mailto:${contact}`;
  }

  return null;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getServiceById(params.id);
  if (!service) return { title: 'Service not found' };

  return {
    title: service.title,
    description: service.summary,
  };
}

export default function ServiceDetailsPage({ params }: PageProps) {
  const service = getServiceById(params.id);
  if (!service) notFound();

  const related = getRelatedServices(service);
  const contactHref = getContactHref(service.contactInfo);

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="h1">{service.title}</h1>
          <p className="lead">{service.summary}</p>
        </div>
        <div className="row">
          <Badge>{service.status}</Badge>
          <Badge>{service.category}</Badge>
        </div>
      </div>

      <div className="row">
        <ButtonLink href="/browse" variant="primary">
          Back to browse
        </ButtonLink>
        <ButtonLink href="/admin/services">Admin</ButtonLink>
      </div>

      <div style={{ height: 16 }} />

      <div className="grid" style={{ gridTemplateColumns: '1.3fr 0.7fr' }}>
        <Card>
          <CardTitle style={{ marginBottom: 8 }}>Overview</CardTitle>
          <CardDescription style={{ marginBottom: 14 }}>
            Pricing and tags for this MCP service.
          </CardDescription>

          <div className="row">
            <Badge>Pricing: {service.pricing}</Badge>
            {service.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <div style={{ height: 14 }} />

          <table className="table">
            <tbody>
              <tr>
                <th style={{ width: 160 }}>Service ID</th>
                <td>{service.id}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{formatDate(service.createdAt)}</td>
              </tr>
              <tr>
                <th>Updated</th>
                <td>{formatDate(service.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card>
          <CardTitle style={{ marginBottom: 8 }}>Contact</CardTitle>
          <CardDescription style={{ marginBottom: 14 }}>
            Reach out to the service owner for access, pricing, or support.
          </CardDescription>

          <div className="row">
            {contactHref ? (
              <ButtonAnchor
                href={contactHref}
                variant="primary"
                target={contactHref.startsWith('http') ? '_blank' : undefined}
                rel={contactHref.startsWith('http') ? 'noreferrer' : undefined}
              >
                Contact
              </ButtonAnchor>
            ) : (
              <Button variant="primary" disabled>
                Contact
              </Button>
            )}
          </div>

          <div style={{ height: 10 }} />

          <p className="hint" style={{ margin: 0 }}>
            {service.contactInfo ? service.contactInfo : 'No contact info provided.'}
          </p>
        </Card>
      </div>

      {related.length ? (
        <>
          <div style={{ height: 18 }} />
          <h2 className="h2">Related services</h2>
          <div style={{ height: 10 }} />
          <div className="grid">
            {related.map((s) => (
              <Card key={s.id}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <CardTitle style={{ marginBottom: 0 }}>{s.title}</CardTitle>
                  <Badge>{s.category}</Badge>
                </div>
                <div style={{ height: 10 }} />
                <CardDescription>{s.summary}</CardDescription>
                <div style={{ height: 12 }} />
                <div className="row">
                  <ButtonLink href={`/services/${s.id}`} variant="primary">
                    View
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
