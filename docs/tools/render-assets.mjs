// Renders the link-preview card and PNG favicons into assets/img/.
// Only needed when the name, title or photo changes. Requires Node 18+ and Playwright:
//   npm i -D playwright && npx playwright install chromium
//   node tools/render-assets.mjs [--font-dir path/with/InstrumentSans.woff2+JetBrainsMono.woff2]
// Run from the docs/ folder. Without --font-dir, system fonts are used.

import { chromium } from "playwright";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const docs = resolve(import.meta.dirname, "..");
const img = (name) => resolve(docs, "assets/img", name);
const fontDirFlag = process.argv.indexOf("--font-dir");
const fontDir = fontDirFlag > -1 ? resolve(process.argv[fontDirFlag + 1]) : null;

const fontFace = (family, file) => {
  const path = fontDir && resolve(fontDir, file);
  if (!path || !existsSync(path)) return "";
  const data = readFileSync(path).toString("base64");
  return `@font-face{font-family:'${family}';font-weight:400 700;src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};

const photo = `data:image/jpeg;base64,${readFileSync(img("fenil.jpg")).toString("base64")}`;

const card = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace("Instrument Sans", "InstrumentSans.woff2")}
${fontFace("JetBrains Mono", "JetBrainsMono.woff2")}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:'Instrument Sans',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
  background:radial-gradient(900px 500px at 85% 20%,#2a3833 0%,#1f2825 55%,#18201d 100%);color:#f4f7f2}
.frame{position:absolute;inset:22px;border:1px solid rgba(240,244,238,.14);border-radius:18px}
.mono{font-family:'JetBrains Mono','SFMono-Regular',Consolas,Menlo,monospace}
.left{position:absolute;left:72px;top:70px;width:720px}
.prompt{font-size:23px;color:#dce7dd}.prompt b{color:#f7c870}.cursor{display:inline-block;width:12px;height:24px;background:#f7c870;vertical-align:-4px;margin-left:4px}
h1{font-size:86px;line-height:1;margin-top:34px;letter-spacing:-.02em;font-weight:700}
h2{font-size:35px;font-weight:600;color:#9fd0bc;margin-top:16px}
p{font-size:25px;line-height:1.4;color:#c8d0c9;margin-top:22px}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.chips span{font-size:16px;color:#dce7dd;border:1px solid rgba(240,244,238,.28);border-radius:8px;padding:8px 11px}
.photo{position:absolute;right:76px;top:96px;width:318px;height:318px;border-radius:18px;object-fit:cover;border:1px solid rgba(240,244,238,.25)}
.side{position:absolute;right:76px;top:432px;width:318px;font-size:18px;line-height:1.55;color:#a3b4a8;text-align:center}
.side b{color:#f7c870;font-weight:700}
.url{position:absolute;left:72px;bottom:52px;font-size:19px;color:#a3b4a8}
</style></head><body><div class="frame"></div>
<div class="left">
  <div class="prompt mono"><b>fenil@toronto</b>:~$ ./hireFenil --role=senior-swe<span class="cursor"></span></div>
  <h1>Fenil Parmar</h1>
  <h2>Senior Cloud Software Engineer</h2>
  <p>Secure, high-throughput cloud systems for finance, and the AI agents that help run them.</p>
  <div class="chips mono"><span>AWS · GCP · Azure</span><span>Terraform</span><span>Distributed systems</span><span>Agentic AI</span></div>
</div>
<img class="photo" src="${photo}" alt="">
<div class="side mono">Nasdaq Verafin · ex-TD Bank<br><b>3× award winner</b> · Toronto</div>
<div class="url mono">11fenil11.github.io/11fenil11</div>
</body></html>`;

const browser = await chromium.launch(
  existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {}
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(card, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: img("social-card.png") });

const svg = readFileSync(img("favicon.svg"), "utf8");
for (const [size, name] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`
  );
  await page.screenshot({ path: img(name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

await browser.close();
console.log("wrote social-card.png, favicon-32.png, apple-touch-icon.png");
