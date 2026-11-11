import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const directory = 'node_modules/@fontsource/manrope';
const cyrillic = await readFile(
  `${directory}/files/manrope-cyrillic-500-normal.woff2`,
);
const latin = await readFile(
  `${directory}/files/manrope-latin-500-normal.woff2`,
);
const logo = await readFile('public/brand/formwork.svg', 'utf8');
const product = await readFile('public/media/02-razbivka.jpg');
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync('/opt/google/chrome/chrome')
      ? '/opt/google/chrome/chrome'
      : undefined),
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<html lang="ru"><head><meta charset="utf-8"><style>
  @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${cyrillic.toString('base64')});font-weight:500;unicode-range:U+0400-052F}
  @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${latin.toString('base64')});font-weight:500;unicode-range:U+0000-00FF}
  *{box-sizing:border-box}body{margin:0;padding:52px;background:#f7f6f0;color:#242827;font-family:Manrope,Arial,sans-serif}header{display:flex;align-items:center;gap:20px;font-size:28px}header svg{width:72px;height:72px}main{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;margin-top:62px}h1{font-size:54px;line-height:1.15;letter-spacing:-2px;font-weight:500;margin:0}p{font-size:21px;line-height:1.6;color:#58605b;margin-top:26px}img{width:100%;height:auto;border:1px solid #c8cec2}
  </style></head><body><header>${logo}<span>FormworkDesigner</span></header><main><div><h1>Расчёт и чертежи<br>опалубки.</h1><p>Контур, раскладка щитов<br>и ведомость элементов.</p></div><img src="data:image/jpeg;base64,${product.toString('base64')}" alt="Интерфейс FormworkDesigner"></main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator('img')
    .evaluate((image: HTMLImageElement) => image.decode());
  await page.screenshot({ path: 'public/social-preview.png' });
  console.log('Generated public/social-preview.png (1200×630)');
} finally {
  await browser.close();
}
