import Link from 'next/link';

import { Container } from '@/components/Container';

export function SiteHeader() {
  return (
    <header className="header">
      <Container>
        <div className="headerInner">
          <div className="brand">
            <Link href="/">MCP Square</Link>
            <span className="brandSub">Next.js 14</span>
          </div>
          <nav className="nav" aria-label="Primary">
            <Link href="/browse">Browse</Link>
            <Link href="/admin/services">Admin</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
