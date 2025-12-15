'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ButtonVariant = 'default' | 'primary';

function getButtonClassName(variant: ButtonVariant, className?: string) {
  return clsx('btn', variant === 'primary' && 'btnPrimary', className);
}

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  return <button className={getButtonClassName(variant, className)} {...props} />;
}

export type ButtonLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & {
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
};

export function ButtonLink({ variant = 'default', className, ...props }: ButtonLinkProps) {
  return <Link className={getButtonClassName(variant, className)} {...props} />;
}
