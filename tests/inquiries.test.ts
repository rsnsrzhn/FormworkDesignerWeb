import test from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry } from '../server/inquiries.ts';
const fields = {
  fullName: 'Тестовый Пользователь',
  email: 'test@example.org',
  phone: '+375291234567',
  consent: true,
  requestId: 'd2b2c7b8-7cda-4d42-99f6-f762c56c545f',
  policyVersion: '2026-11-09',
  website: '',
};
const env = {
  ACCEPT_INQUIRIES: 'true',
  RESEND_API_KEY: 'test-only',
  INQUIRY_FROM: 'test@example.org',
  INQUIRY_TO: 'owner@example.org',
};
function req(body: unknown = fields, headers: Record<string, string> = {}) {
  return new Request('https://site.test/api/inquiries', {
    method: 'POST',
    headers: {
      origin: 'https://site.test',
      'content-type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
test('disabled delivery never acknowledges an enquiry', async () => {
  assert.equal((await handleInquiry(req(), {})).status, 503);
});
test('requires consent and valid contact details before delivery', async () => {
  const response = await handleInquiry(
    req({ ...fields, consent: false, email: 'bad' }),
    env,
  );
  assert.equal(response.status, 400);
  const data = await response.json();
  assert.ok(data.errors.consent && data.errors.email);
});
test('rejects cross-origin, invalid JSON, wrong content type and oversized body', async () => {
  assert.equal(
    (await handleInquiry(req(fields, { origin: 'https://evil.test' }), env))
      .status,
    403,
  );
  assert.equal((await handleInquiry(req('{'), env)).status, 400);
  assert.equal(
    (await handleInquiry(req(fields, { 'content-type': 'text/plain' }), env))
      .status,
    415,
  );
  assert.equal((await handleInquiry(req('x'.repeat(9000)), env)).status, 413);
});
test('rejects obsolete policy, malformed id, honeypot and non-string contacts', async () => {
  for (const body of [
    { ...fields, policyVersion: 'old' },
    { ...fields, requestId: 'bad' },
    { ...fields, website: 'spam' },
    { ...fields, fullName: {} },
  ]) {
    assert.equal((await handleInquiry(req(body), env)).status, 400);
  }
});
test('accepts only after actual provider acknowledgement and forwards idempotency', async () => {
  let called = 0;
  const response = await handleInquiry(req(), env, async (url, init) => {
    called++;
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(
      new Headers(init?.headers).get('Idempotency-Key'),
      `inquiry/${fields.requestId}`,
    );
    assert.equal(JSON.parse(String(init?.body)).reply_to, fields.email);
    return new Response(JSON.stringify({ id: 'provider-message-id' }), {
      status: 200,
    });
  });
  assert.equal(called, 1);
  assert.equal(response.status, 202);
});
test('provider failure, malformed success and timeout do not become success', async () => {
  const deliveries = [
    async () => new Response('{}', { status: 500 }),
    async () => new Response('{}'),
    async () => {
      throw new Error('timeout');
    },
  ];
  for (const deliver of deliveries)
    assert.equal((await handleInquiry(req(), env, deliver)).status, 502);
});
test('GET does not submit and missing origin is rejected', async () => {
  assert.equal(
    (await handleInquiry(new Request('https://site.test/api/inquiries'), env))
      .status,
    405,
  );
  const r = req();
  r.headers.delete('origin');
  assert.equal((await handleInquiry(r, env)).status, 403);
});
