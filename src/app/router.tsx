import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { focusPageHeading } from '@/app/focus';
import { resolveRoute } from '@/app/routes';
import type { LinkTarget, RouteId } from '@/app/routes';

/**
 * Roteador mínimo baseado em hash (#/caminho). Funciona em qualquer hospedagem estática,
 * sem regras de reescrita no servidor, o que facilita a apresentação da demonstração.
 */
let pendingSection: string | null = null;

export function readPath(): string {
  const raw = window.location.hash.replace(/^#/, '').split('?')[0];
  return raw && raw.startsWith('/') ? raw : '/';
}

/** Parâmetros após o "?" do hash atual (ex.: #/cursos?q=react). */
export function readQuery(): URLSearchParams {
  const hash = window.location.hash.replace(/^#/, '');
  const index = hash.indexOf('?');
  return new URLSearchParams(index >= 0 ? hash.slice(index + 1) : '');
}

/** Troca só os parâmetros do endereço atual, sem criar nova entrada no histórico e sem rolar a página. */
export function replaceQuery(params: URLSearchParams): void {
  const query = params.toString();
  const next = `#${readPath()}${query ? `?${query}` : ''}`;
  if (window.location.hash === next) return;
  try {
    window.history.replaceState(window.history.state, '', next);
  } catch {
    /* alguns navegadores limitam chamadas seguidas; o estado em memória continua correto */
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

export function usePath(): string {
  return useSyncExternalStore(subscribe, readPath, () => '/');
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function flushScroll(moveFocus = false): void {
  const section = pendingSection;
  pendingSection = null;
  window.requestAnimationFrame(() => {
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        el.focus({ preventScroll: true });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (moveFocus) focusPageHeading();
  });
}

/** Endereço atual depois do "#", com a query (ex.: /cursos?q=react). Vazio equivale à página inicial. */
const currentTarget = (): string => window.location.hash.replace(/^#/, '') || '/';

export function navigate(to: string, section?: string): void {
  pendingSection = section ?? null;
  if (currentTarget() === to) {
    flushScroll();
    return;
  }
  const samePath = readPath() === to.split('?')[0];
  window.location.hash = to;
  // Mesmo caminho com outra query (ex.: "Cursos" no menu estando em /cursos?q=react): nenhum efeito de rota vai rolar
  // a página nem consumir a seção pendente, então isso é feito aqui. O catálogo reage ao evento hashchange.
  if (samePath) flushScroll();
}

/** Vai para outro endereço substituindo o atual no histórico (o botão voltar não retorna à página de origem). */
export function replacePath(to: string): void {
  pendingSection = null;
  window.location.replace(`#${to}`);
}

/** Deve ser chamado uma vez no layout: rola a página e leva o foco ao título após cada mudança de rota. */
export function useScrollOnNavigate(): void {
  const path = usePath();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    // Na primeira carga não se mexe no foco: só nas trocas de rota seguintes.
    flushScroll(previous.current !== null && previous.current !== path);
    previous.current = path;
  }, [path]);
}

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: string;
  section?: string;
  /** Alternativa a `to`: usa uma rota registrada (com fallback para seção, se ainda não implementada). */
  route?: RouteId;
  children: ReactNode;
}

export function useLinkTarget(to?: string, section?: string, route?: RouteId): LinkTarget {
  if (route) return resolveRoute(route);
  return { to: to ?? '/', section };
}

export function AppLink({ to, section, route, onClick, children, ...rest }: AppLinkProps) {
  const target = useLinkTarget(to, section, route);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return;
    event.preventDefault();
    navigate(target.to, target.section);
  };

  return (
    <a href={`#${target.to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
