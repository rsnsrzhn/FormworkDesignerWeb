import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "../src/pages/Home";
import { Purchase } from "../src/pages/Purchase";
import { Faq } from "../src/pages/Faq";
import { Legal } from "../src/pages/Legal";
import { Contact } from "../src/pages/Contact";
const html = renderToStaticMarkup(<Home />);
assert.ok(html.includes("От контура"));
assert.ok(html.includes("Android"));
assert.ok(html.includes("Десктоп"));
assert.ok(html.includes("platform-section"));
assert.ok(!html.includes("Инструмент для проектирования опалубки"));
assert.ok(!html.includes("window-bar"));
assert.equal((html.match(/<video/g) || []).length, 5);
assert.ok(html.includes("Предварительная оценка"));
assert.ok(!/href="[^"]+\.exe"/.test(html));
assert.ok(renderToStaticMarkup(<Purchase />).includes("Стоимость зависит"));
const faq = renderToStaticMarkup(<Faq />);
assert.equal((faq.match(/<details/g) || []).length, 7);
assert.ok(!faq.includes("Нужна ли регистрация"));
assert.ok(faq.includes("поддержк"));
const legal = renderToStaticMarkup(<Legal config={null} />);
assert.ok(!legal.includes("Документ готовится"));
assert.ok(!legal.includes("не является завершённой"));
assert.ok(legal.includes("отозвать согласие"));
const contact = renderToStaticMarkup(
  <Contact config={null} retryConfig={() => {}} />
);
assert.ok(contact.includes('name="consent"'));
assert.ok(!contact.includes('checked=""'));
assert.ok(contact.includes('disabled=""'));
console.log(
  "PASS: render of home, purchase, 7 relevant FAQ answers, privacy information, mandatory unchecked consent, disabled unavailable form"
);
