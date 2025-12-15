import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Container } from '@/components/Container';
import { SiteHeader } from '@/components/SiteHeader';
import { getSiteUrl, site } from '@/lib/site';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="main">
          <Container>{children}</Container>
        </main>
        <footer className="footer">
          <Container>
            <small>
              {site.name} — scaffolded with Next.js 14 (App Router) + TypeScript (strict)
            </small>
          </Container>
        </footer>
      </body>
    </html>
  );
}
