import { useEffect, useId, useRef, useState } from 'react';
import { AppLink, usePath } from '@/app/router';
import { getRoute } from '@/app/routes';
import { mainNav } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useBrand } from '@/hooks/useBrand';

export function Header() {
  const path = usePath();
  const { user } = useAuth();
  const brand = useBrand();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Fecha o menu ao trocar de rota, com Esc, ou ao ampliar a janela.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      // Mesmo limiar do CSS (60em = 960px com a fonte padrão), para o menu fechar quando o layout de desktop aparece.
      if (window.matchMedia('(min-width: 60em)').matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  const normalized = path.replace(/\/+$/, '') || '/';
  const isCurrent = (item: NavItem) => {
    if (!item.route) return false;
    const route = getRoute(item.route);
    if (!route.implemented) return false;
    // A página inicial só é "atual" nela mesma; as demais também valem nas páginas filhas (ex.: detalhes de um curso).
    return route.path === '/' ? normalized === '/' : normalized === route.path || normalized.startsWith(`${route.path}/`);
  };

  const renderItem = (item: NavItem) => (
    <li key={item.label}>
      <AppLink
        className="nav__link"
        route={item.route}
        to={item.route ? undefined : '/'}
        section={item.section}
        aria-current={isCurrent(item) ? 'page' : undefined}
        onClick={close}
      >
        {item.label}
      </AppLink>
    </li>
  );

  return (
    <header className="site-header surface-dark" data-open={open}>
      <div className="container site-header__bar">
        <AppLink to="/" className="site-header__brand" aria-label={`${brand.name} — ir para o início`} onClick={close}>
          <Logo />
        </AppLink>

        <nav className="nav" aria-label="Navegação principal">
          <ul className="nav__list">{mainNav.map(renderItem)}</ul>
        </nav>

        <div className="site-header__actions">
          {user ? (
            <>
              <AppLink route="student" className="student-link">
                <Icon name="user" size={18} />
                <span>Área do aluno</span>
                <span className="student-link__tag">demo</span>
              </AppLink>
              <ButtonLink route="logout" variant="ghost" className="site-header__cta">
                Sair
              </ButtonLink>
            </>
          ) : (
            <>
              <AppLink route="login" className="student-link">
                <Icon name="user" size={18} />
                <span>Entrar</span>
                <span className="student-link__tag">demo</span>
              </AppLink>
              <ButtonLink route="signup" variant="accent" className="site-header__cta">
                Criar conta
              </ButtonLink>
            </>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      <div id={menuId} className="mobile-menu" hidden={!open}>
        <div className="container mobile-menu__inner">
          <nav aria-label="Navegação principal (celular)">
            <ul className="mobile-menu__list">{mainNav.map(renderItem)}</ul>
          </nav>
          <div className="mobile-menu__actions">
            {user ? (
              <>
                <ButtonLink route="student" variant="secondary" icon="user" fullWidth onClick={close}>
                  Área do aluno (demo)
                </ButtonLink>
                <ButtonLink route="logout" variant="ghost" fullWidth onClick={close}>
                  Sair
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink route="login" variant="secondary" icon="user" fullWidth onClick={close}>
                  Entrar (demo)
                </ButtonLink>
                <ButtonLink route="signup" variant="accent" fullWidth onClick={close}>
                  Criar conta
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
