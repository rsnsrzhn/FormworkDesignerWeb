import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const publicRoot = new URL("../public/", import.meta.url);
test("HTML uses new blue favicon URLs and a valid multi-size ICO fallback", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8"
  );
  assert.ok(html.includes("/favicon-blue.svg"));
  assert.ok(html.includes("/favicon-blue.ico"));
  assert.ok(!html.includes('href="/favicon.svg"'));
  const svg = await readFile(new URL("favicon-blue.svg", publicRoot), "utf8");
  assert.ok(svg.includes("#80c1f3"));
  const icon = await readFile(new URL("favicon-blue.ico", publicRoot));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 4);
  assert.deepEqual(
    [0, 1, 2, 3].map((index) => icon[6 + 16 * index]),
    [16, 32, 48, 64]
  );
  assert.deepEqual(icon, await readFile(new URL("favicon.ico", publicRoot)));
});
