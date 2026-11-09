import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
let server;
if (!process.env.PREVIEW_URL) {
  server = spawn(process.execPath, ['--import', 'tsx', 'scripts/preview.ts'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: '4173', ACCEPT_INQUIRIES: 'false' },
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('preview startup timeout')),
      15000,
    );
    server.stdout.on('data', (data) => {
      if (String(data).includes('Local:')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.on('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`preview exited ${code}`));
    });
  });
}
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync('/opt/google/chrome/chrome')
      ? '/opt/google/chrome/chrome'
      : undefined),
  args: ['--no-sandbox'],
});
await mkdir('test-results', { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const home = await page.goto(base);
  assert.equal(home.status(), 200);
  await page.getByRole('heading', { name: /Опалубка. Всё сходится/ }).waitFor();
  assert.ok(
    await page.locator('meta[name="description"]').getAttribute('content'),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: 'test-results/home-desktop.png',
    fullPage: true,
  });
  console.log('PASS rendered homepage and metadata');
  await page.getByRole('link', { name: 'Попробовать в деле' }).click();
  const demo = page.locator('#demo');
  await demo.getByLabel('Ширина', { exact: true }).fill('9');
  await demo.getByLabel('Длина', { exact: true }).fill('10');
  await demo.getByRole('button', { name: 'Перейти к раскладке' }).click();
  await demo.getByLabel('1,8 м', { exact: true }).check();
  await demo.getByRole('button', { name: 'Построить раскладку' }).click();
  assert.ok(
    (await demo.locator('.demo-results').textContent()).includes('9 × 10'),
  );
  assert.ok(
    (await demo.locator('.demo-results').textContent()).includes('136,8'),
  );
  await demo.getByRole('button', { name: 'Что дальше?' }).click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.locator('dialog').evaluate((el) => el.open), true);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await demo.getByRole('button', { name: 'Что дальше?' }).click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Заполнить заявку' })
    .click();
  assert.equal(new URL(page.url()).pathname, '/contact');
  console.log(
    'PASS complete guided tutorial, live geometry, dismissible dialog and cooperation CTA',
  );
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  assert.ok((await page.locator('[aria-invalid=true]').count()) >= 3);
  await page.getByLabel('ФИО').fill('Тестовый Пользователь');
  await page.getByLabel('Электронная почта').fill('test@example.org');
  await page.getByLabel('Телефон', { exact: false }).fill('+375291234567');
  assert.equal(await page.getByRole('checkbox').isChecked(), false);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(
    await page.getByLabel('ФИО').inputValue(),
    'Тестовый Пользователь',
  );
  console.log(
    'PASS form validation, unchecked consent and unavailable delivery preserves input',
  );
  // Provider acknowledgement and failure are tested against the real handler in npm test.
  await page.route('**/api/site-config', (route) =>
    route.fulfill({
      json: {
        inquiriesEnabled: true,
        development: false,
        operatorName: '',
        operatorAddress: '',
        privacyEmail: '',
        policyVersion: '2026-11-09',
      },
    }),
  );
  await page.reload();
  await page.getByLabel('ФИО').fill('Тестовый Пользователь');
  await page.getByLabel('Электронная почта').fill('test@example.org');
  await page.getByLabel('Телефон', { exact: false }).fill('+375291234567');
  await page.getByRole('checkbox').check();
  await page.route('**/api/inquiries', (route) =>
    route.fulfill({
      status: 502,
      json: { message: 'Тестовый отказ доставки' },
    }),
  );
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(
    await page.getByLabel('ФИО').inputValue(),
    'Тестовый Пользователь',
  );
  await page.unroute('**/api/inquiries');
  await page.route('**/api/inquiries', (route) =>
    route.fulfill({
      status: 202,
      json: { accepted: true, message: 'accepted' },
    }),
  );
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await page.getByRole('heading', { name: 'Заявка принята.' }).waitFor();
  console.log('PASS simulated provider failure and success UI (no email sent)');
  await page.unroute('**/api/site-config');
  await page.unroute('**/api/inquiries');
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/purchase',
      '/contact',
      '/faq',
      '/privacy',
      '/consent',
    ]) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200);
      await page.locator('h1').waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow ${path} at ${width}`,
      );
    }
  }
  console.log('PASS six routes at 360/390/768/1024/1440px');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.screenshot({
    path: 'test-results/home-mobile.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page
    .getByRole('navigation', { name: 'Основная навигация' })
    .getByRole('link', { name: 'Обсудить проект' })
    .click();
  await page.locator('.form-card').waitFor();
  const fields = await page
    .locator('.form-field input')
    .evaluateAll((elements) =>
      elements.map((el) => ({
        x: el.getBoundingClientRect().x,
        width: el.getBoundingClientRect().width,
      })),
    );
  assert.ok(
    fields.every(
      (field) => field.x === fields[0].x && field.width === fields[0].width,
    ),
  );
  await page.screenshot({
    path: 'test-results/contact-mobile.png',
    fullPage: true,
  });
  await page.goto(base);
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Перейти к раскладке' }).click();
  await page.getByRole('button', { name: 'Построить раскладку' }).click();
  await page.getByRole('button', { name: 'Что дальше?' }).click();
  await page.screenshot({
    path: 'test-results/demo-mobile.png',
    fullPage: true,
  });
  await page.keyboard.press('Escape');
  await page
    .getByRole('button', { name: 'Начать демонстрацию заново' })
    .click();
  assert.equal(
    await page.getByLabel('Ширина', { exact: true }).inputValue(),
    '6',
  );
  console.log(
    'PASS mobile navigation, aligned fields, tutorial modal and reset',
  );
  await page.goto(base + '/faq');
  await page
    .locator('summary')
    .filter({ hasText: 'Что можно попробовать прямо на сайте?' })
    .click();
  assert.equal(await page.locator('details[open]').count(), 1);
  const missing = await page.goto(base + '/missing-page');
  assert.equal(missing.status(), 404);
  assert.equal(
    await page.locator('meta[name=robots]').getAttribute('content'),
    'noindex, follow',
  );
  assert.deepEqual(errors, []);
  console.log(
    'PASS FAQ, genuine HTTP 404 and no browser runtime/hydration errors',
  );
} finally {
  await browser.close();
  server?.kill('SIGTERM');
}
