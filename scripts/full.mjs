// Capture pleine page en faisant défiler progressivement (déclenche les animations à l'entrée)
import { chromium } from "playwright";
const [,, url, out, w = "1440", h = "900", extra = ""] = process.argv;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: extra.includes("reduce") ? "reduce" : "no-preference", hasTouch: extra.includes("touch"), isMobile: extra.includes("touch") });
await ctx.addInitScript(() => { try { localStorage.setItem("dg-consent", JSON.stringify({ mesure: false, date: "x" })); sessionStorage.setItem("dg-seen", "1"); } catch {} });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
p.on("console", (m) => { if ((m.type() === "error" || m.type() === "warning") && !m.text().includes("Clock")) console.log("CONSOLE", m.type(), m.text().slice(0, 400)); });
await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(1500);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const shots = [];
let i = 0;
for (let y = 0; y < total; y += +h) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(1300);
  const f = `${out}-${String(i++).padStart(2, "0")}.png`;
  await p.screenshot({ path: f });
  shots.push(f);
}
console.log(shots.join(" "));
await b.close();
