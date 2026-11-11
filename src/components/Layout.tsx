import { useEffect, useState } from 'react';
import { Link } from './Link';
import { Icon } from './Icon';
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="FormworkDesigner — главная">
      <img
        className="brand-mark"
        src="/brand/formwork-small.svg"
        width="32"
        height="32"
        alt=""
      />
      <span>
        Formwork<span className="brand-light">Designer</span>
      </span>
    </Link>
  );
}
export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <button
          className="menu-toggle"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <nav
          id="navigation"
          aria-label="Основная навигация"
          className={open ? 'nav is-open' : 'nav'}
        >
          {[
            ['/', 'Возможности'],
            ['/#in-action', 'Приложение'],
            ['/purchase', 'Сотрудничество'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button button-small"
            onClick={() => setOpen(false)}
          >
            Обсудить проект <Icon name="arrow" size={17} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
export function Footer({ year = 2026 }: { year?: number }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Чертежи опалубки.
              <br />
              Десктоп и Android.
            </p>
          </div>
          <div className="footer-links">
            <Link href="/purchase">Сотрудничество</Link>
            <Link href="/contact">Связаться с нами</Link>
          </div>
          <address className="footer-location footer-contact">
            <span>Связаться с нами</span>
            <a href="mailto:info.formworkss@gmail.com">
              info.formworkss@gmail.com
            </a>
          </address>
        </div>
        <div className="footer-bottom">
          <span>© {year} FormworkDesigner</span>
          <div>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/consent">Обработка персональных данных</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function CTA() {
  return (
    <section className="cta-band">
      <div className="container cta">
        <div>
          <h2>
            Давайте посмотрим
            <br />
            на ваши задачи.
          </h2>
          <p>
            Покажем возможности FormworkDesigner и обсудим функционал, который
            нужен именно вашей компании.
          </p>
        </div>
        <Link className="button button-light" href="/contact">
          Обсудить сотрудничество <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
