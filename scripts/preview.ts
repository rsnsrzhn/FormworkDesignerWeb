import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { handleApi } from '../server/http.ts';
process.env.NODE_ENV ||= 'production';
const root = resolve('dist');
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res);
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
      res.writeHead(405).end();
      return;
    }
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      res
        .writeHead(308, { Location: url.pathname.slice(0, -1) + url.search })
        .end();
      return;
    }
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(root + '/') && file !== root) {
      res.writeHead(403).end();
      return;
    }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      file = resolve(root, '404.html');
      status = 404;
    }
    const data = await readFile(file);
    res.writeHead(status, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(400).end('Invalid request');
  }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () =>
  console.log(`Local: http://localhost:${process.env.PORT || 4173}`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
