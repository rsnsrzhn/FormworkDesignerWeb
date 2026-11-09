import test from 'node:test';
import assert from 'node:assert/strict';
import { sendInquiry } from '../src/lib/api.ts';
const fields = {
  fullName: 'Тестовый Пользователь',
  email: 'test@example.org',
  phone: '+375291234567',
  consent: true,
};
test('HTML or malformed HTTP 200 cannot become a successful enquiry', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('<html>not an API</html>', { status: 200 }),
  );
  assert.ok((await sendInquiry(fields, 'id', '2026-11-09', '')).message);
});
test('only an explicit accepted acknowledgement completes the enquiry', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ accepted: true }, { status: 202 }),
  );
  assert.deepEqual(await sendInquiry(fields, 'id', '2026-11-09', ''), {});
});
