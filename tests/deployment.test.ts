import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateInquiry } from '../src/lib/validation.ts';
import { getSiteConfig } from '../server/config.ts';
test('deployment denies framing, inline executable code and foreign connections', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const headers = Object.fromEntries(
    config.headers[0].headers.map((h: { key: string; value: string }) => [
      h.key,
      h.value,
    ]),
  );
  assert.match(headers['Content-Security-Policy'], /script-src 'self';/);
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.match(headers['Content-Security-Policy'], /connect-src 'self'/);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.ok(
    config.redirects.some(
      (r: { source: string; destination: string; permanent: boolean }) =>
        r.source === '/faq' && r.destination === '/' && r.permanent,
    ),
  );
});
test('public configuration never serializes delivery credentials or recipient', () => {
  const config = JSON.stringify(
    getSiteConfig({
      RESEND_API_KEY: 'secret-marker',
      INQUIRY_TO: 'private-recipient',
      INQUIRY_FROM: 'private-sender',
    }),
  );
  assert.doesNotMatch(config, /secret-marker|private-recipient|private-sender/);
});
test('email rejects control characters before it reaches mail provider', () => {
  assert.ok(
    validateInquiry({
      fullName: 'Иван Иванов',
      email: 'ivan\u0000@example.org',
      phone: '+375291234567',
      consent: true,
    }).email,
  );
});

test('deployment ignore rules do not exclude public product media', async () => {
  const ignore = await readFile('.vercelignore', 'utf8');
  const patterns = ignore.split(/\r?\n/).map((line) => line.trim());
  assert.ok(
    !patterns.some((line) =>
      /^(?:\*\*\/)?(?:public\/)?media(?:\/.*)?$/.test(line),
    ),
    'Product media must be included in Vercel deployments',
  );
  const gitignore = await readFile('.gitignore', 'utf8');
  assert.ok(
    !gitignore.split(/\r?\n/).includes('media/'),
    'Local source media exclusion must be root-anchored',
  );
});
