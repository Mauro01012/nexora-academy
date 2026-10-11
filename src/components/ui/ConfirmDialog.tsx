import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmação antes de ações destrutivas. O foco começa em "Cancelar", Esc cancela e o foco volta a quem abriu. */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = 'Cancelar', onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    return () => opener?.focus?.();
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onCancel();
    } else if (event.key === 'Tab') {
      const first = cancelRef.current;
      const last = confirmRef.current;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dialog card" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} onKeyDown={onKeyDown}>
        <h2 id={titleId} className="display dialog__title">
          {title}
        </h2>
        <div id={descId} className="dialog__text">
          {children}
        </div>
        <div className="dialog__actions">
          <button ref={cancelRef} type="button" className="btn btn--secondary btn--md" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button ref={confirmRef} type="button" className="btn btn--danger btn--md" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
