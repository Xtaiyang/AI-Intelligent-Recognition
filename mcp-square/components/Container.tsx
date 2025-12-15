import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('container', className)} {...props} />;
}
