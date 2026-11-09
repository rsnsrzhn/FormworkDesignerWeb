import { build } from 'vite';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { htmlPage, productionOrigin } from './html.ts';
import { getSiteConfig } from '../server/config.ts';
await build();
await build({
  build: { ssr: 'src/entry-server.tsx', outDir: '.server', emptyOutDir: true },
});
const { render, pages } = await import('../.server/entry-server.js');
const template = await readFile('dist/index.html', 'utf8');
for (const path of Object.keys(pages)) {
  const folder = path === '/' ? 'dist' : `dist${path}`;
  await mkdir(folder, { recursive: true });
  await writeFile(
    `${folder}/index.html`,
    htmlPage(template, path, render(path, getSiteConfig())),
  );
}
await writeFile(
  'dist/404.html',
  htmlPage(template, '/404', render('/404', getSiteConfig())),
);
const origin = productionOrigin();
const preview =
  process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
const xml = origin
  ? Object.keys(pages)
      .filter((path) => !['/privacy', '/consent'].includes(path))
      .map(
        (path) =>
          `  <url><loc>${origin.replaceAll('&', '&amp;')}${path}</loc></url>`,
      )
      .join('\n')
  : '';
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xml}\n</urlset>\n`,
);
await writeFile(
  'dist/robots.txt',
  preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`,
);
await rm('.server', { recursive: true, force: true });
console.log(
  `Prerendered ${Object.keys(pages).length} pages + HTTP 404. ${origin ? `SEO origin: ${origin}` : 'Set SITE_URL or enable Vercel production URL system variable for canonical/sitemap.'}`,
);
