import { useEffect, useState } from 'react';
import { Link } from './Link';
import { Icon } from './Icon';
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="FormworkDesigner — главная">
      <svg
        className="brand-mark"
        width="32"
        height="32"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="9" fill="#12263c" />
        <path d="M12 30V10h19v5H18v4h10v5H18v6z" fill="#80c1f3" />
      </svg>
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
            ['/faq', 'Вопросы'],
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
            <Link href="/faq">Частые вопросы</Link>
          </div>
          <div className="footer-location">
            Для специалистов
            <br />
            России и Беларуси
          </div>
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
    <section className="container cta">
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
    </section>
  );
}
