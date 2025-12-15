'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

export type ModalProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ open, title, children, footer, onClose, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className={clsx('modal', className)} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
        </div>
        <div className="modalBody">{children}</div>
        {footer ? <div className="modalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
