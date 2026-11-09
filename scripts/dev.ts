import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import { handleApi } from '../server/http.ts';
import { htmlPage } from './html.ts';
import { getSiteConfig } from '../server/config.ts';
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
});
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res);
      return;
    }
    vite.middlewares(req, res, async () => {
      try {
        const path = url.pathname.replace(/\/$/, '') || '/';
        const template = await vite.transformIndexHtml(
          path,
          await readFile('index.html', 'utf8'),
        );
        const { render, pages } = await vite.ssrLoadModule(
          '/src/entry-server.tsx',
        );
        res
          .writeHead(pages[path] ? 200 : 404, {
            'Content-Type': 'text/html; charset=utf-8',
          })
          .end(htmlPage(template, path, render(path, getSiteConfig())));
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        console.error(error);
        res.writeHead(500).end('Page rendering failed');
      }
    });
  } catch {
    res.writeHead(500).end('Request failed');
  }
});
server.listen(Number(process.env.PORT || 5173), '127.0.0.1', () =>
  console.log(`Local: http://localhost:${process.env.PORT || 5173}`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => {
    server.close();
    void vite.close().then(() => process.exit(0));
  });
