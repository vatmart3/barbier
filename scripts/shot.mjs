import { chromium } from "playwright";
const [,, url, out, w = "1440", h = "900", full = "0", wait = "1500", scrollY = "0"] = process.argv;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("CONSOLE", m.type(), m.text().slice(0, 300)); });
await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(+wait);
if (+scrollY) { await p.mouse.wheel(0, +scrollY); await p.waitForTimeout(1500); }
await p.screenshot({ path: out, fullPage: full === "1" });
await b.close();
