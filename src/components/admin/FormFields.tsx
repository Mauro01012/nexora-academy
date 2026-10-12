import { useId } from 'react';
import type { SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Field, describedBy } from '@/components/ui/Field';
import type { FieldMessages } from '@/components/ui/Field';

export function SelectField({ label, hint, error, id, children, ...rest }: FieldMessages & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field id={fieldId} label={label} hint={hint} error={error}>
      <select id={fieldId} className="input input--select" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint, error)} {...rest}>
        {children}
      </select>
    </Field>
  );
}

export function TextAreaField({ label, hint, error, id, ...rest }: FieldMessages & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field id={fieldId} label={label} hint={hint} error={error}>
      <textarea id={fieldId} className="input input--area" rows={4} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fieldId, hint, error)} {...rest} />
    </Field>
  );
}
