import { useEffect, useState } from 'react';
import { Header, Footer } from './components/Layout';
import { Link } from './components/Link';
import { Home } from './pages/Home';
import { Purchase } from './pages/Purchase';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { Legal } from './pages/Legal';
import { getSiteConfig, type SiteConfig } from './lib/api';
export function App({
  path,
  initialConfig = null,
}: {
  path: string;
  initialConfig?: SiteConfig | null;
}) {
  const [config, setConfig] = useState<SiteConfig | null>(initialConfig);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getSiteConfig(controller.signal)
      .then(setConfig)
      .catch(() => {});
    return () => controller.abort();
  }, [attempt]);
  const content =
    path === '/' ? (
      <Home />
    ) : path === '/purchase' ? (
      <Purchase />
    ) : path === '/contact' ? (
      <Contact config={config} retryConfig={() => setAttempt((n) => n + 1)} />
    ) : path === '/faq' ? (
      <Faq />
    ) : ['/privacy', '/consent'].includes(path) ? (
      <Legal config={config} consent={path === '/consent'} />
    ) : (
      <section className="container page-hero not-found">
        <span className="eyebrow">Ошибка 404</span>
        <h1>
          Такого чертежа
          <br />
          <span>здесь пока нет.</span>
        </h1>
        <p>Возможно, адрес страницы изменился.</p>
        <Link href="/" className="button">
          На главную →
        </Link>
      </section>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <Header path={path} />
      <main id="main">{content}</main>
      <Footer year={config?.copyrightYear} />
    </>
  );
}
