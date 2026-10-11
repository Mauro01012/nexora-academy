import { AppLink } from '@/app/router';
import { getRoute } from '@/app/routes';
import { useBrand } from '@/hooks/useBrand';
import { footerColumns } from '@/config/navigation';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const brand = useBrand();
  return (
    <footer className="site-footer surface-dark surface-deep">
      <div className="container site-footer__grid">
        <div className="site-footer__about">
          <AppLink to="/" aria-label={`${brand.name} — ir para o início`}>
            <Logo />
          </AppLink>
          <p className="site-footer__text">{brand.description}</p>
          <address className="site-footer__contact">
            <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
            <span>{brand.contact.city}</span>
            <span>{brand.contact.hours}</span>
          </address>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} className="site-footer__col" aria-label={column.title}>
            <h2 className="site-footer__title">{column.title}</h2>
            <ul>
              {column.items.map((item) => {
                const planned = item.route ? !getRoute(item.route).implemented && !getRoute(item.route).fallbackSection : false;
                return (
                  <li key={item.label}>
                    <AppLink route={item.route} to={item.route ? undefined : '/'} section={item.section}>
                      {item.label}
                    </AppLink>
                    {planned ? <span className="tag-soon">em breve</span> : null}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container site-footer__legal">
        <p>
          © {new Date().getFullYear()} {brand.name}. {brand.demo.notice}
        </p>
      </div>
    </footer>
  );
}
