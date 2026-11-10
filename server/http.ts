import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleInquiry } from './inquiries.js';
import { getSiteConfig } from './config.js';
import { createRateLimiter } from './rate-limit.js';
const allowSubmission = createRateLimiter(5, 60_000);
export type ParsedRequest = IncomingMessage & { body?: unknown };
export async function handleApi(req: ParsedRequest, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path === '/api/site-config') {
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' }).end();
      return;
    }
    res
      .writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      .end(JSON.stringify(getSiteConfig()));
    return;
  }
  if (path !== '/api/inquiries') {
    res.writeHead(404).end();
    return;
  }
  if (req.method === 'POST') {
    const client = String(
      process.env.VERCEL
        ? req.headers['x-vercel-forwarded-for'] || req.socket.remoteAddress
        : req.socket.remoteAddress,
    );
    if (!allowSubmission(client)) {
      res
        .writeHead(429, {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        })
        .end(
          JSON.stringify({
            message: 'Слишком много попыток. Попробуйте через минуту.',
          }),
        );
      return;
    }
  }
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers))
    if (typeof value === 'string') headers.set(key, value);
  const protocol =
    process.env.VERCEL || req.headers['x-forwarded-proto'] === 'https'
      ? 'https'
      : 'http';
  let body: string | undefined;
  if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
    if (req.body !== undefined)
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    else {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of req) {
        size += Buffer.byteLength(chunk);
        if (size > 8192) {
          res
            .writeHead(413, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ message: 'Слишком большой запрос.' }));
          return;
        }
        chunks.push(Buffer.from(chunk));
      }
      body = Buffer.concat(chunks).toString('utf8');
    }
  }
  const request = new Request(
    `${protocol}://${req.headers.host || 'localhost'}${path}`,
    { method: req.method, headers, body },
  );
  const result = await handleInquiry(request);
  res.writeHead(result.status, Object.fromEntries(result.headers));
  res.end(await result.text());
}
