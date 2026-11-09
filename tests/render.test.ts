import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App.tsx';
test('all routes render meaningful content without browser globals', () => {
  for (const path of [
    '/',
    '/purchase',
    '/contact',
    '/faq',
    '/privacy',
    '/consent',
    '/404',
  ]) {
    const html = renderToString(createElement(App, { path }));
    assert.match(html, /<h1/);
    assert.match(html, /FormworkDesigner/);
    if (path === '/') {
      assert.match(html, /Попробуйте/);
      assert.match(html, /90%/);
      assert.match(html, /сэкономленного времени/i);
      assert.match(html, /Предварительная оценка разработчика/);
      assert.match(html, /Учебная/);
    }
    if (path === '/404') assert.match(html, /404/);
  }
});

test('copyright uses serialized year rather than browser clock', async () => {
  const { Footer } = await import('../src/components/Layout.tsx');
  const html = renderToString(createElement(Footer, { year: 2040 }));
  assert.match(html.replace(/<!--.*?-->/gs, ''), /© 2040 FormworkDesigner/);
});
