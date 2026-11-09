import { pages } from '../src/site.ts';
import { getSiteConfig } from '../server/config.ts';
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
export function productionOrigin() {
  const value =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '');
  if (!value) return '';
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('SITE_URL must use http or https');
  return url.origin;
}
export function htmlPage(template: string, path: string, content: string) {
  const page = pages[path] || {
    title: 'Страница не найдена — FormworkDesigner',
    description: 'Такой страницы не существует.',
  };
  const origin = productionOrigin();
  const noindex =
    !pages[path] ||
    (Boolean(process.env.VERCEL_ENV) &&
      process.env.VERCEL_ENV !== 'production');
  const config = getSiteConfig();
  const head = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ru_RU" />',
    '<meta property="og:site_name" content="FormworkDesigner" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(origin && pages[path]
      ? [
          `<link rel="canonical" href="${escape(origin + path)}" />`,
          `<meta property="og:url" content="${escape(origin + path)}" />`,
          `<meta property="og:image" content="${escape(origin)}/social-preview.png" />`,
        ]
      : []),
    ...(noindex ? ['<meta name="robots" content="noindex, follow" />'] : []),
    ...(path === '/'
      ? [
          `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'FormworkDesigner', applicationCategory: 'DesignApplication', operatingSystem: 'Windows, Android', description: page.description, ...(origin ? { url: origin } : {}) })}</script>`,
        ]
      : []),
    `<script id="site-config" type="application/json">${json(config)}</script>`,
  ].join('\n  ');
  return template
    .replace('<!--seo-->', head)
    .replace('<!--app-html-->', content);
}
