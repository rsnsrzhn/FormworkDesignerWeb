import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../server/rate-limit.ts';
test('bounds submissions per client and allows retries after the window', () => {
  const allow = createRateLimiter(3, 60000);
  assert.equal(allow('client-a', 0), true);
  assert.equal(allow('client-a', 100), true);
  assert.equal(allow('client-a', 200), true);
  assert.equal(allow('client-a', 300), false);
  assert.equal(allow('client-b', 300), true);
  assert.equal(allow('client-a', 60000), true);
});
