import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AppLink, readQuery, replacePath } from '@/app/router';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DEMO_EMAIL } from '@/services/demoStore';
import { safeNextPath, validateEmail, validatePassword } from '@/utils/validation';

type Errors = { email?: string; password?: string };

export function Login() {
  useDocumentTitle('Entrar');
  const { isAuthenticated, logIn } = useAuth();
  const next = safeNextPath(readQuery().get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  // Com sessão ativa (logo após entrar, ou ao abrir /entrar já conectado), segue para o destino.
  useEffect(() => {
    if (isAuthenticated) replacePath(next ?? '/aluno');
  }, [isAuthenticated, next]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = { email: validateEmail(email), password: validatePassword(password) };
    if (found.email || found.password) {
      setErrors(found);
      document.getElementById(found.email ? 'login-email' : 'login-password')?.focus();
      return;
    }
    const result = logIn(email);
    setPassword(''); // a senha nunca é guardada: o valor é descartado logo após a validação
    if (!result.ok) {
      setErrors({ email: result.message });
      document.getElementById('login-email')?.focus();
    }
  };

  const hasErrors = Boolean(errors.email || errors.password);
  const signupTo = next ? `/cadastro?next=${encodeURIComponent(next)}` : '/cadastro';

  return (
    <AuthShell
      eyebrow="Conta de demonstração"
      title="Entrar na plataforma"
      intro="Use o e-mail de uma conta criada aqui neste navegador."
      footer={
        <>
          Ainda não tem conta de demonstração? <AppLink to={signupTo}>Criar conta</AppLink>
        </>
      }
    >
      <form className="auth-form" noValidate onSubmit={submit}>
        {hasErrors ? (
          <p className="form-summary" role="alert">
            Revise os campos destacados.
          </p>
        ) : null}
        <Input
          id="login-email"
          type="email"
          label="E-mail"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
        />
        <Input
          id="login-password"
          type="password"
          label="Senha"
          autoComplete="current-password"
          hint="Nesta demonstração só o formato é conferido (mínimo de 8 caracteres)."
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
        />
        <Button type="submit" variant="primary" fullWidth>
          Entrar
        </Button>
      </form>

      <div className="auth-sample">
        <p>
          Quer só explorar? A conta de exemplo (<code>{DEMO_EMAIL}</code>) já tem cursos e progresso fictícios.
        </p>
        <Button variant="secondary" fullWidth onClick={() => logIn(DEMO_EMAIL)}>
          Entrar com a conta de exemplo
        </Button>
      </div>
    </AuthShell>
  );
}
