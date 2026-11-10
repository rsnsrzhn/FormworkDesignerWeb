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

test('leaving the form aborts the pending client request', async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.ok(options?.signal);
    return new Promise<Response>((_resolve, reject) => {
      options!.signal!.addEventListener(
        'abort',
        () => reject(new DOMException('Aborted', 'AbortError')),
        { once: true },
      );
    });
  });
  const pending = sendInquiry(
    fields,
    'id',
    '2026-11-09',
    '',
    controller.signal,
  );
  controller.abort();
  assert.ok((await pending).message);
});
