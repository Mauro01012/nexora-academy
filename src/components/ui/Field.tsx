import type { ReactNode } from 'react';

export interface FieldMessages {
  label: string;
  hint?: string;
  error?: string;
}

/** Ids dos textos de apoio de um campo, na ordem em que são lidos (dica, depois erro). */
export const describedBy = (id: string, hint?: string, error?: string): string | undefined =>
  [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

/**
 * Estrutura única dos campos de formulário: rótulo, controle, dica e erro.
 * O erro não usa `role="alert"`: o foco vai ao primeiro campo inválido e o erro é lido pela descrição do campo;
 * o aviso geral do formulário (`.form-summary`) é quem anuncia a falha.
 */
export function Field({ id, label, hint, error, className = '', children }: FieldMessages & { id: string; className?: string; children: ReactNode }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
