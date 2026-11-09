import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
const base = process.env.FILE_PREVIEW
  ? "https://preview.formwork.test"
  : process.env.PREVIEW_URL || "http://localhost:5173";
const localChrome = "/opt/google/chrome/chrome";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync(localChrome) ? localChrome : undefined),
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
if (process.env.FILE_PREVIEW) {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const mime = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".jpg": "image/jpeg",
    ".mp4": "video/mp4",
    ".html": "text/html",
  };
  await page.route("**/*", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const file = pathname.startsWith("/media/")
      ? path.join(
          root,
          "../../opalubka-roliki-2026-11-02",
          path.basename(pathname)
        )
      : path.join(
          root,
          "dist",
          path.extname(pathname) ? pathname : "index.html"
        );
    try {
      await route.fulfill({
        body: await readFile(file),
        contentType: mime[path.extname(file)] || "application/octet-stream",
      });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
}
const config = {
  inquiriesEnabled: true,
  development: true,
  operatorName: "",
  operatorAddress: "",
  privacyEmail: "",
  policyVersion: "2026-11-03",
  retentionMonths: 12,
};
let configRequests = 0;
await page.route("**/api/site-config", (route) => {
  configRequests++;
  return route.fulfill({ json: config });
});
await page.goto(base);
await page.getByRole("heading", { name: /От контура/ }).waitFor();
assert.equal(await page.locator(".media-window").count(), 5);
assert.equal(await page.locator(".hero-badge, .window-bar").count(), 0);
assert.equal(await page.locator("[data-reveal='pending']").count(), 0);
assert.equal(
  await page
    .locator(".brand-mark")
    .first()
    .evaluate((element) => element.tagName.toLowerCase()),
  "svg"
);
assert.equal(
  await page
    .locator("main p, main li, .media-caption, .footer-bottom")
    .evaluateAll((elements) =>
      elements
        .filter((element) => element.getClientRects().length)
        .every(
          (element) => parseFloat(getComputedStyle(element).fontSize) >= 14
        )
    ),
  true
);
assert.equal(await page.locator('a[href$=".exe"]').count(), 0);
await page.screenshot({
  path: "/tmp/formwork-home-desktop.png",
  fullPage: true,
});
console.log("PASS desktop home, 5 real media, no EXE download");
await page
  .getByRole("link", { name: "Покупка и доработка", exact: true })
  .first()
  .click();
await page.getByRole("heading", { name: /Программа под задачи/ }).waitFor();
assert.equal(
  configRequests,
  1,
  "Internal navigation must not refetch site configuration"
);
await page.reload();
await page.getByRole("heading", { name: /Программа под задачи/ }).waitFor();
console.log("PASS direct route reload");
await page.goto(base + "/faq");
await page
  .getByText("Что входит в ведомость опалубки?", { exact: true })
  .click();
assert.equal(await page.locator("details[open]").count(), 1);
console.log("PASS FAQ disclosure");
await page.goto(base + "/contact");
await page.getByRole("button", { name: "Отправить заявку" }).waitFor();
assert.equal(await page.getByRole("checkbox").isChecked(), false);
await page.getByRole("button", { name: "Отправить заявку" }).click();
assert.ok((await page.locator("[aria-invalid=true]").count()) >= 3);
await page.getByLabel("ФИО").fill("Тестовый Пользователь");
await page.getByLabel("Электронная почта").fill("test@example.org");
await page.getByLabel("Телефон", { exact: false }).fill("+375 (29) 123-45-67");
await page.getByRole("checkbox").check();
await page.route("**/api/inquiries", (route) => route.abort("failed"));
await page.getByRole("button", { name: "Отправить заявку" }).click();
await page.getByRole("alert").waitFor();
assert.equal(
  await page.getByLabel("ФИО").inputValue(),
  "Тестовый Пользователь"
);
console.log(
  "PASS client validation, mandatory consent, network failure preserves fields"
);
await page.unroute("**/api/inquiries");
let submissions = 0;
await page.route("**/api/inquiries", async (route) => {
  submissions++;
  await new Promise((resolve) => setTimeout(resolve, 150));
  await route.fulfill({ status: 202, json: { message: "ok" } });
});
await page.getByRole("button", { name: "Отправить заявку" }).click();
await page.getByRole("heading", { name: "Заявка принята." }).waitFor();
assert.equal(submissions, 1);
console.log("PASS form success with simulated API");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await page.getByRole("button", { name: "Открыть меню" }).click();
await page
  .getByRole("navigation")
  .getByRole("link", { name: /Обсудить проект/ })
  .click();
await page.getByRole("heading", { name: /Ваш следующий/ }).waitFor();
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
);
await page.screenshot({
  path: "/tmp/formwork-contact-mobile.png",
  fullPage: true,
});
console.log("PASS mobile menu and layout without horizontal overflow");
await page.goto(base);
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
);
await page.screenshot({
  path: "/tmp/formwork-home-mobile.png",
  fullPage: true,
});
for (const route of ["/privacy", "/consent"]) {
  await page.goto(base + route);
  await page.locator("h1").waitFor();
  assert.equal(await page.locator("h1").count(), 1);
}
await page.goto(base + "/missing");
await page.getByRole("heading", { name: /Такого чертежа/ }).waitFor();
assert.deepEqual(errors, []);
console.log("PASS legal pages, not-found page, no runtime exceptions");
for (const width of [360, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/",
    "/purchase",
    "/contact",
    "/faq",
    "/privacy",
    "/consent",
  ]) {
    await page.goto(base + route);
    await page.locator("h1").waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      `Overflow: ${route} at ${width}px`
    );
  }
}
assert.deepEqual(errors, []);
console.log(
  "PASS responsive layout across all pages at 360, 768, 1024, 1440px"
);
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto(base);
await page
  .locator("[data-reveal='pending']")
  .first()
  .waitFor({ state: "attached" });
await page.locator(".feature-media").last().scrollIntoViewIfNeeded();
await page.waitForFunction(
  () =>
    [...document.querySelectorAll(".feature-media")]
      .at(-1)
      ?.getAttribute("data-reveal") !== "pending"
);
console.log("PASS scroll reveal and reduced-motion fallback");
await page
  .getByRole("navigation")
  .getByRole("link", { name: "Покупка и доработка", exact: true })
  .click();
await page.getByRole("heading", { name: /Программа под задачи/ }).waitFor();
await page.goBack();
await page.getByRole("heading", { name: /От контура/ }).waitFor();
await page.waitForFunction(() => document.activeElement?.id === "main");
console.log("PASS animated navigation, browser back and accessible page focus");
await browser.close();
