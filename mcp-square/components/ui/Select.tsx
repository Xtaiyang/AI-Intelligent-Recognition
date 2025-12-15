import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export type SelectProps = ComponentPropsWithoutRef<'select'>;

export function Select({ className, ...props }: SelectProps) {
  return <select className={clsx('select', className)} {...props} />;
}
