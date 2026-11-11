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
    '/privacy',
    '/consent',
    '/404',
  ]) {
    const html = renderToString(createElement(App, { path }));
    assert.match(html, /<h1/);
    assert.match(html, /FormworkDesigner/);
    if (path === '/') {
      assert.match(html, /Посмотреть приложение/);
      assert.doesNotMatch(html, /90%/);
      assert.match(html, /демоверси/i);
      assert.doesNotMatch(html, /В демоверсии недоступны/);
      assert.doesNotMatch(
        html,
        /Учебная схема|status-dot|scene-check|workflow-number/,
      );
      assert.match(html, /ведомост/);
    }
    if (path === '/404') assert.match(html, /404/);
  }
});

test('copyright uses serialized year rather than browser clock', async () => {
  const { Footer } = await import('../src/components/Layout.tsx');
  const html = renderToString(createElement(Footer, { year: 2040 }));
  assert.match(html.replace(/<!--.*?-->/gs, ''), /© 2040 FormworkDesigner/);
});

test('first HTML paint has stylesheet and a bounded logo before JavaScript', async () => {
  const { readFile } = await import('node:fs/promises');
  const { Brand } = await import('../src/components/Layout.tsx');
  const template = await readFile('index.html', 'utf8');
  assert.match(
    template,
    /<link[^>]*rel="stylesheet"[^>]*href="\/src\/styles.css"/,
  );
  const html = renderToString(createElement(Brand));
  assert.match(html, /<img[^>]*width="32"[^>]*height="32"/);
});
