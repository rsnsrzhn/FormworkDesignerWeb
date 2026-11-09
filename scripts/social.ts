import { chromium } from 'playwright';
import { readFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const directory = 'node_modules/@fontsource/ibm-plex-sans';
const cyrillic = await readFile(
  `${directory}/files/ibm-plex-sans-cyrillic-500-normal.woff2`,
);
const latin = await readFile(
  `${directory}/files/ibm-plex-sans-latin-500-normal.woff2`,
);
const drawing = await readFile('public/drawings/house-plan.svg', 'utf8');
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
    @font-face{font-family:Plex;src:url(data:font/woff2;base64,${cyrillic.toString('base64')});font-weight:500;unicode-range:U+0400-045F}
    @font-face{font-family:Plex;src:url(data:font/woff2;base64,${latin.toString('base64')});font-weight:500}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f5f8fc;color:#172d45;font-family:Plex,Arial,sans-serif;overflow:hidden}.drawing{position:absolute;inset:0 0 0 340px;opacity:.65}.drawing svg{width:1060px;height:730px;position:absolute;top:-35px;left:0}.wash{position:absolute;inset:0;background:linear-gradient(90deg,#fff 0%,#fffffff5 36%,#ffffff00 92%)}main{position:relative;padding:65px}.brand{font-size:23px;letter-spacing:-.8px}h1{font-size:82px;line-height:1.04;letter-spacing:-4px;font-weight:500;margin:90px 0 25px}h1 span{color:#2465d0}p{font-size:20px;color:#5e7187;line-height:1.5;max-width:450px}.footer{position:absolute;bottom:45px;left:65px;color:#5e7187;font-size:14px}
  </style></head><body><div class="drawing">${drawing}</div><div class="wash"></div><main><div class="brand">FormworkDesigner</div><h1>Меньше рутины.<br/><span>Больше проекта.</span></h1><p>Контур. Раскладка щитов.<br/>Комплект документов.</p></main><div class="footer">Приложение для проектирования опалубки</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-preview.png' });
  await copyFile(`${directory}/LICENSE`, 'public/font-license.txt');
  console.log('Generated public/social-preview.png (1200×630)');
} finally {
  await browser.close();
}
