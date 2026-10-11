import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AppLink, readQuery, replacePath } from '@/app/router';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PASSWORD_MIN, safeNextPath, validateConfirm, validateEmail, validateName, validatePassword } from '@/utils/validation';

type Errors = { name?: string; email?: string; password?: string; confirm?: string; ack?: string };
const order: (keyof Errors)[] = ['name', 'email', 'password', 'confirm', 'ack'];

export function Signup() {
  useDocumentTitle('Criar conta');
  const { isAuthenticated, signUp } = useAuth();
  const next = safeNextPath(readQuery().get('next'));
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', ack: false });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isAuthenticated) replacePath(next ?? '/aluno');
  }, [isAuthenticated, next]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const focusFirst = (found: Errors) => {
    const first = order.find((key) => found[key]);
    if (first) document.getElementById(`signup-${first}`)?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
      ack: form.ack ? undefined : 'Confirme que entendeu que esta é uma demonstração.',
    };
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      focusFirst(found);
      return;
    }
    const result = signUp(form.name, form.email);
    setForm((current) => ({ ...current, password: '', confirm: '' })); // senhas descartadas
    if (!result.ok) {
      const failed: Errors = { email: result.message };
      setErrors(failed);
      focusFirst(failed);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const loginTo = next ? `/entrar?next=${encodeURIComponent(next)}` : '/entrar';

  return (
    <AuthShell
      eyebrow="Conta de demonstração"
      title="Criar conta"
      intro="Cadastro simulado para conhecer a área do aluno. Pode usar dados fictícios."
      footer={
        <>
          Já criou uma conta aqui? <AppLink to={loginTo}>Entrar</AppLink>
        </>
      }
    >
      <form className="auth-form" noValidate onSubmit={submit}>
        {hasErrors ? (
          <p className="form-summary" role="alert">
            Revise os campos destacados.
          </p>
        ) : null}
        <Input id="signup-name" label="Nome" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => set('name', e.target.value)} />
        <Input
          id="signup-email"
          type="email"
          label="E-mail"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          hint="Pode ser fictício. Fica só neste navegador."
          value={form.email}
          error={errors.email}
          onChange={(e) => set('email', e.target.value)}
        />
        <Input
          id="signup-password"
          type="password"
          label="Senha"
          autoComplete="new-password"
          hint={`Mínimo de ${PASSWORD_MIN} caracteres. Não é guardada nem enviada.`}
          value={form.password}
          error={errors.password}
          onChange={(e) => set('password', e.target.value)}
        />
        <Input
          id="signup-confirm"
          type="password"
          label="Repita a senha"
          autoComplete="new-password"
          value={form.confirm}
          error={errors.confirm}
          onChange={(e) => set('confirm', e.target.value)}
        />
        <div className={`check ${errors.ack ? 'check--error' : ''}`.trim()}>
          <input
            id="signup-ack"
            type="checkbox"
            checked={form.ack}
            aria-invalid={errors.ack ? true : undefined}
            aria-describedby={errors.ack ? 'signup-ack-error' : undefined}
            onChange={(e) => set('ack', e.target.checked)}
          />
          <label htmlFor="signup-ack">Entendo que é uma demonstração, sem conta real nem segurança de produção.</label>
        </div>
        {errors.ack ? (
          <p id="signup-ack-error" className="field__error" role="alert">
            {errors.ack}
          </p>
        ) : null}
        <Button type="submit" variant="primary" fullWidth>
          Criar conta de demonstração
        </Button>
      </form>
    </AuthShell>
  );
}
