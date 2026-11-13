import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("portfolio renders its real content and resume is a PDF", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("https://example.com/"),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Owen Shi/);
  assert.match(html, /Harvard/);
  assert.match(html, /id="projects"/);
  assert.match(html, /id="bik"/);
  assert.match(html, /SpringForge/);
  assert.match(html, /<video[^>]*controls/);
  assert.match(html, /id="experience"/);
  assert.doesNotMatch(
    html,
    /terminal-input|welcome.sh|Building things from the metal/,
  );
  assert.match(html, /github.com\/Bi1ku/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
  const pdf = await readFile(
    new URL("../public/Owen_Shi_Resume.pdf", import.meta.url),
  );
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
});
