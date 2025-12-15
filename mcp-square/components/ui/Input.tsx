import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export type InputProps = ComponentPropsWithoutRef<'input'>;

export function Input({ className, ...props }: InputProps) {
  return <input className={clsx('input', className)} {...props} />;
}
