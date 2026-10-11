import { matchRoute } from '@/app/routes';

/** Validações básicas dos formulários. Retornam a mensagem de erro ou undefined quando o valor é aceito. */
export const PASSWORD_MIN = 8;

export const validateName = (value: string): string | undefined => {
  const name = value.trim();
  if (!name) return 'Informe seu nome.';
  if (name.length < 2) return 'Use ao menos 2 caracteres.';
  if (name.length > 60) return 'Use no máximo 60 caracteres.';
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();
  if (!email) return 'Informe seu e-mail.';
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Informe um e-mail válido, como nome@exemplo.com.';
  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return 'Informe uma senha.';
  if (value.length < PASSWORD_MIN) return `Use ao menos ${PASSWORD_MIN} caracteres.`;
  if (value.length > 128) return 'Use no máximo 128 caracteres.';
  return undefined;
};

export const validateConfirm = (password: string, confirm: string): string | undefined => {
  if (!confirm) return 'Repita a senha.';
  return password === confirm ? undefined : 'As senhas não são iguais.';
};

/** Aceita só caminhos internos conhecidos (evita redirecionar para endereços arbitrários). */
export function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.length > 200) return null;
  let match;
  try {
    match = matchRoute(raw.split('?')[0]);
  } catch {
    return null;
  }
  if (!match || ['login', 'signup', 'logout'].includes(match.route.id)) return null;
  return raw;
}
