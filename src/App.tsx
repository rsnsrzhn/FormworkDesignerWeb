import { mountScrollMotion } from './lib/motion';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { pages } from './site';
import { Header, Footer } from './components/Layout';
import { Link } from './components/Link';
import { Home } from './pages/Home';
import { Purchase } from './pages/Purchase';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { getSiteConfig, type SiteConfig } from './lib/api';
export function App({
  path: initialPath,
  initialConfig = null,
}: {
  path: string;
  initialConfig?: SiteConfig | null;
}) {
  const [path, setPath] = useState(initialPath);
  const [config, setConfig] = useState<SiteConfig | null>(initialConfig);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let changing = false;
    async function change(target: string, push: boolean) {
      if (changing) return;
      changing = true;
      const url = new URL(target, location.origin);
      const main = document.getElementById('main');
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (main && !reduced)
        await main
          .animate(
            [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }],
            { duration: 140, easing: 'ease-in' },
          )
          .finished.catch(() => {});
      if (push) history.pushState(null, '', target);
      flushSync(() => setPath(url.pathname));
      const page = pages[url.pathname];
      if (page) {
        document.title = page.title;
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', page.description);
        document
          .querySelector('meta[property="og:title"]')
          ?.setAttribute('content', page.title);
        document
          .querySelector('meta[property="og:description"]')
          ?.setAttribute('content', page.description);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          const base = new URL(canonical.getAttribute('href')!);
          canonical.setAttribute('href', base.origin + url.pathname);
        }
        document
          .querySelector('meta[property="og:url"]')
          ?.setAttribute('content', location.origin + url.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (url.hash)
        document
          .getElementById(url.hash.slice(1))
          ?.scrollIntoView({ behavior: 'instant' });
      main?.focus({ preventScroll: true });
      changing = false;
    }
    const onNavigate = (event: Event) => {
      void change((event as CustomEvent<string>).detail, true);
    };
    const onPop = () => {
      void change(location.pathname + location.search + location.hash, false);
    };
    window.addEventListener('site:navigate', onNavigate);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('site:navigate', onNavigate);
      window.removeEventListener('popstate', onPop);
    };
  }, []);
  useEffect(() => {
    if (!['/contact', '/privacy', '/consent'].includes(path)) return;
    const controller = new AbortController();
    getSiteConfig(controller.signal)
      .then(setConfig)
      .catch(() => {});
    return () => controller.abort();
  }, [attempt, path]);
  useEffect(() => {
    const main = document.getElementById('main');
    let cleanup: (() => void) | undefined;
    const frame = requestAnimationFrame(() => {
      if (main) cleanup = mountScrollMotion(main);
    });
    return () => {
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [path]);
  const content =
    path === '/' ? (
      <Home />
    ) : path === '/purchase' ? (
      <Purchase />
    ) : path === '/contact' ? (
      <Contact config={config} retryConfig={() => setAttempt((n) => n + 1)} />
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
      <main id="main" tabIndex={-1}>
        {content}
      </main>
      <Footer year={config?.copyrightYear} />
    </>
  );
}
