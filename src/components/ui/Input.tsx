import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Field, describedBy } from '@/components/ui/Field';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** Campo de texto acessível: rótulo associado, dica e erro ligados por `aria-describedby`. */
export function Input({ label, hint, error, id, className = '', ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} className={className}>
      <input id={inputId} className="input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(inputId, hint, error)} {...rest} />
    </Field>
  );
}
