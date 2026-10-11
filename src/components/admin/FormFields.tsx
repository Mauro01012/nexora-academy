import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface Common {
  label: string;
  hint?: string;
  error?: string;
}

function Wrapper({ id, label, hint, error, children }: Common & { id: string; children: ReactNode }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
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
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

export function SelectField({ label, hint, error, id, children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Wrapper id={fieldId} label={label} hint={hint} error={error}>
      <select id={fieldId} className="input input--select" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint, error)} {...rest}>
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({ label, hint, error, id, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Wrapper id={fieldId} label={label} hint={hint} error={error}>
      <textarea id={fieldId} className="input input--area" rows={4} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint, error)} {...rest} />
    </Wrapper>
  );
}
