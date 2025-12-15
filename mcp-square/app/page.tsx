import Link from 'next/link';

import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { listServices } from '@/lib/services';

export default function HomePage() {
  const services = listServices();
  const categories = Array.from(new Set(services.map((s) => s.category))).sort();
  const featured = services.filter((s) => s.status === 'active').slice(0, 6);

  return (
    <div>
      <section className="hero">
        <div>
          <h1 className="h1">MCP Square</h1>
          <p className="lead">
            Discover MCP services across AI, data, safety, and developer tooling. Search, filter, and
            open a listing to learn more.
          </p>

          <div className="row">
            <ButtonLink href="/browse" variant="primary">
              Browse services
            </ButtonLink>
            <ButtonLink href="/browse">Explore trending</ButtonLink>
          </div>

          <div style={{ height: 16 }} />

          <nav aria-label="Browse by category" className="chips">
            <Link className="chip" href="/browse">
              All
            </Link>
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category}
                className="chip"
                href={`/browse?category=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>

        <Card className="heroPanel">
          <CardTitle>Featured this week</CardTitle>
          <CardDescription>
            {services.length} services indexed — curated picks based on activity.
          </CardDescription>
          <div style={{ height: 14 }} />
          <div className="row">
            <ButtonLink href="/browse" variant="primary">
              Browse all
            </ButtonLink>
            <ButtonLink href="/admin/services">Admin</ButtonLink>
          </div>
        </Card>
      </section>

      <div style={{ height: 22 }} />

      <section aria-label="Featured services">
        <div className="sectionHeader">
          <h2 className="h2">Featured services</h2>
          <p className="muted">A small set of active services to get started quickly.</p>
        </div>

        <div className="grid">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} label="Featured" />
          ))}
        </div>

        <div style={{ height: 16 }} />

        <div className="row">
          <ButtonLink href="/browse" variant="primary">
            Browse all services
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
