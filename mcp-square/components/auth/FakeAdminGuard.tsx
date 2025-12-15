'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';

const STORAGE_KEY = 'mcp-square:demo-admin';

type FakeAdminGuardProps = {
  children: ReactNode;
};

export function FakeAdminGuard({ children }: FakeAdminGuardProps) {
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const byQuery = searchParams.get('as') === 'admin' || searchParams.get('admin') === '1';
    const byStorage = window.localStorage.getItem(STORAGE_KEY) === '1';

    if (byQuery || byStorage) {
      window.localStorage.setItem(STORAGE_KEY, '1');
      setAllowed(true);
    }
  }, [searchParams]);

  if (allowed) {
    return (
      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div />
          <Button
            onClick={() => {
              window.localStorage.removeItem(STORAGE_KEY);
              setAllowed(false);
            }}
          >
            Sign out (demo)
          </Button>
        </div>
        <div style={{ height: 12 }} />
        {children}
      </div>
    );
  }

  return (
    <Card>
      <CardTitle style={{ marginBottom: 8 }}>Admin access required</CardTitle>
      <CardDescription>
        This is a placeholder role guard. Click below to unlock the admin UI for this session.
      </CardDescription>
      <div style={{ height: 14 }} />
      <div className="row">
        <Button
          variant="primary"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, '1');
            setAllowed(true);
          }}
        >
          Enter admin (demo)
        </Button>
      </div>
    </Card>
  );
}
