import { chromium } from 'playwright';
import { readFile, readdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormworkScene } from '../src/components/FormworkScene.tsx';
const dir = 'node_modules/@fontsource-variable/manrope';
const names = await readdir(`${dir}/files`);
const font = names.find(
  (name) => name === 'manrope-cyrillic-wght-normal.woff2',
)!;
const latin = names.find((name) => name === 'manrope-latin-wght-normal.woff2')!;
const data = await readFile(`${dir}/files/${font}`);
const latinData = await readFile(`${dir}/files/${latin}`);
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
  const scene = renderToStaticMarkup(createElement(FormworkScene));
  await page.setContent(
    `<html lang="ru"><head><meta charset="utf-8"><style>@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${data.toString('base64')});font-weight:200 800;unicode-range:U+0400-045F}@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${latinData.toString('base64')});font-weight:200 800}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f6f9fd;color:#172d45;font-family:Manrope,sans-serif;padding:53px 58px}.brand{font-size:23px;font-weight:750;letter-spacing:-1px;display:flex;align-items:center;gap:12px}.mark{background:#122b47;color:#8bc1fa;border-radius:9px;padding:3px 13px;font-size:31px}main{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:25px;margin-top:42px}h1{font-size:75px;line-height:1.08;letter-spacing:-5px;margin:20px 0}h1 span{color:#2465d0}.eyebrow{font-size:12px;letter-spacing:2px;color:#2465d0;font-weight:700}p{color:#63758a;font-size:17px;line-height:1.7;max-width:390px}.scene{background:#edf4fc;border:1px solid #dce7f3;border-radius:16px;padding-block:20px}.scene svg{width:100%;display:block}.footer{position:absolute;bottom:43px;left:58px;font-size:13px;color:#63758a}</style></head><body><div class="brand"><span class="mark">F</span>FormworkDesigner</div><main><div><div class="eyebrow">ПРОЕКТИРОВАНИЕ ОПАЛУБКИ</div><h1>Опалубка.<br/><span>Всё сходится.</span></h1><p>От первого контура до раскладки щитов и рабочего листа.</p></div><div class="scene">${scene}</div></main><div class="footer">Контур → раскладка → документы</div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-preview.png' });
  await copyFile(`${dir}/LICENSE`, 'public/font-license.txt');
  console.log('Generated public/social-preview.png (1200×630)');
} finally {
  await browser.close();
}
