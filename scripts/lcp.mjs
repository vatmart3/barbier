// Journal des entrées LCP (CPU ×4, réseau lent) : node scripts/lcp.mjs url
import { chromium } from "playwright";
const url = process.argv[2];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
await p.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push({ t: Math.round(e.startTime), size: e.size, el: e.element ? e.element.tagName + "." + String(e.element.className?.baseVal ?? e.element.className).slice(0, 60) + " «" + (e.element.textContent || "").slice(0, 30) + "»" : e.url }))).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push({ t: Math.round(e.startTime), paint: e.name }))).observe({ type: "paint", buffered: true });
});
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(6000);
console.log(await p.evaluate(() => window.__lcp));
const res = await p.evaluate(() => performance.getEntriesByType("resource").filter((r) => /woff2|\.css|chunks/.test(r.name)).map((r) => [r.name.split("/").pop().slice(0, 30), Math.round(r.startTime), Math.round(r.responseEnd)]));
console.log(res);
await b.close();
