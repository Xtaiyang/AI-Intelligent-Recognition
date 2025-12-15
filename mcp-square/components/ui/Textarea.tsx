import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={clsx('textarea', className)} {...props} />;
}
