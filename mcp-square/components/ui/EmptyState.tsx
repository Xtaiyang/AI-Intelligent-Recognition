'use client';

import type { ReactNode } from 'react';

import { Card, CardDescription, CardTitle } from '@/components/ui/Card';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card role="status" aria-live="polite">
      <CardTitle style={{ marginBottom: 6 }}>{title}</CardTitle>
      {description ? <CardDescription>{description}</CardDescription> : null}
      {action ? (
        <>
          <div style={{ height: 14 }} />
          {action}
        </>
      ) : null}
    </Card>
  );
}
