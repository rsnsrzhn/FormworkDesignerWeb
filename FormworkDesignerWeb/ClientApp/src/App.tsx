import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animatePageIntro } from "./lib/pageTransition";
import { Header, Footer } from "./components/Layout";
import { Link } from "./components/Link";
import { Home } from "./pages/Home";
import { Purchase } from "./pages/Purchase";
import { Contact } from "./pages/Contact";
import { Faq } from "./pages/Faq";
import { Legal } from "./pages/Legal";
import { getSiteConfig, type SiteConfig } from "./lib/api";
import { mountScrollMotion } from "./lib/scrollMotion";
const titles: Record<string, string> = {
  "/": "Чертежи опалубки на десктопе и Android",
  "/purchase": "Покупка и индивидуальная доработка",
  "/contact": "Обсудить сотрудничество",
  "/faq": "Частые вопросы",
  "/privacy": "Политика конфиденциальности",
  "/consent": "Согласие на обработку данных",
};
export function App() {
  const [path, setPath] = useState(location.pathname.replace(/\/$/, "") || "/");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [attempt, setAttempt] = useState(0);
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const requestedPath = useRef(path);
  const retryConfig = useCallback(() => setAttempt((n) => n + 1), []);
  useEffect(() => {
    const listener = () => {
      const next = location.pathname.replace(/\/$/, "") || "/";
      if (next === requestedPath.current) return;
      requestedPath.current = next;
      setPath(next);
    };
    window.addEventListener("popstate", listener);
    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getSiteConfig(controller.signal)
      .then(setConfig)
      .catch(() => {});
    return () => controller.abort();
  }, [attempt]);
  useLayoutEffect(() => {
    document.title = `${
      titles[path] || "Страница не найдена"
    } — FormworkDesigner`;
    if (!first.current) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      main.current?.focus({ preventScroll: true });
    }
    first.current = false;
    return animatePageIntro(main.current?.querySelector("h1") ?? null);
  }, [path]);
  useEffect(() => {
    if (main.current) return mountScrollMotion(main.current);
  }, [path]);
  const content =
    path === "/" ? (
      <Home />
    ) : path === "/purchase" ? (
      <Purchase />
    ) : path === "/contact" ? (
      <Contact config={config} retryConfig={retryConfig} />
    ) : path === "/faq" ? (
      <Faq />
    ) : path === "/privacy" || path === "/consent" ? (
      <Legal config={config} consent={path === "/consent"} />
    ) : (
      <section className="container page-hero">
        <span className="eyebrow">404</span>
        <h1>
          Такого чертежа
          <br />
          здесь пока нет.
        </h1>
        <p>Возможно, адрес страницы изменился.</p>
        <Link className="button" href="/">
          На главную
        </Link>
      </section>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <Header path={path} />
      <main id="main" className="page-content" ref={main} tabIndex={-1}>
        {content}
      </main>
      <Footer />
    </>
  );
}
