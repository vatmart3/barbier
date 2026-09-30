// Captures d'une séquence de scroll : node scripts/seq.mjs url prefix w h y1,y2,...
import { chromium } from "playwright";
import { existsSync } from "node:fs";
// Chromium de l'environnement si présent, sinon celui de Playwright (npx playwright install chromium)
const chrome = () => process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined);
const [,, url, prefix, w = "1440", h = "900", ys = "0", extra = ""] = process.argv;
const b = await chromium.launch({ executablePath: chrome(), args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: extra.includes("reduce") ? "reduce" : "no-preference", hasTouch: extra.includes("touch"), isMobile: extra.includes("touch") });
await ctx.addInitScript(() => { try { localStorage.setItem("dg-consent", JSON.stringify({ mesure: false, date: "x" })); sessionStorage.setItem("dg-seen", "1"); } catch {} });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("CONSOLE", m.type(), m.text().slice(0, 400)); });
await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(2500);
for (const y of ys.split(",").map(Number)) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${prefix}-${y}.png` });
}
await b.close();
