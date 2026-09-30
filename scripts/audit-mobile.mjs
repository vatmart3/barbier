import { chromium } from "playwright";
import { existsSync } from "node:fs";
// Audit mobile : débordements horizontaux (320 → 430 px), textes < 12 px et zones tactiles < 40 px (détail en 390 px)
const base = process.argv[2] ?? "http://localhost:3100";
const pages = ["/", "/coupes", "/equipe", "/reserver", "/infos", "/mentions-legales", "/confidentialite"];
const widths = [320, 360, 375, 390, 414, 430];
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined) });
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { localStorage.setItem("dg-consent", '{"mesure":false}'); });
  for (const path of pages) {
    const p = await ctx.newPage();
    await p.goto(base + path, { waitUntil: "networkidle" });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } document.querySelectorAll("[data-reveal]").forEach(e => e.setAttribute("data-vu", "")); window.scrollTo(0, 0); });
    await p.waitForTimeout(900);
    const r = await p.evaluate((w) => {
      const out = { scrollW: document.documentElement.scrollWidth, overflow: [], smallText: [], smallTap: [] };
      const seen = new Set();
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const rc = el.getBoundingClientRect();
        if (rc.width === 0 || rc.height === 0) continue;
        // skip inside horizontal scrollers / clipped ancestors
        let a = el.parentElement, clipped = false;
        while (a && a !== document.body) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= w + 1 && ar.left >= -1) { clipped = true; break; } } a = a.parentElement; }
        const id = (el.tagName + "." + (el.className?.baseVal ?? el.className ?? "")).slice(0, 90) + " «" + (el.textContent || "").trim().slice(0, 30) + "»";
        if (!clipped && (rc.right > w + 1 || rc.left < -1) && !el.closest(".sr-only,[class*=sr-only]") && cs.position !== "fixed") { if (!seen.has(id)) { seen.add(id); out.overflow.push(`${Math.round(rc.left)}→${Math.round(rc.right)} ${id}`); } }
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (hasText && parseFloat(cs.fontSize) < 12 && !el.closest("[aria-hidden=true]")) out.smallText.push(`${cs.fontSize} ${id}`);
        if (el.matches("a,button,[role=button],input,select,label[for]") && !el.closest("p,li>p,figcaption,.prose") ) { if ((rc.height < 40 || rc.width < 40) && cs.position !== "absolute") out.smallTap.push(`${Math.round(rc.width)}x${Math.round(rc.height)} ${id}`); }
      }
      out.smallText = [...new Set(out.smallText)].slice(0, 12); out.smallTap = [...new Set(out.smallTap)].slice(0, 12); out.overflow = out.overflow.slice(0, 10);
      return out;
    }, w);
    const bad = r.scrollW > w || r.overflow.length;
    if (bad || r.smallText.length || r.smallTap.length) {
      console.log(`\n=== ${w}px ${path}  scrollWidth=${r.scrollW}${r.scrollW > w ? "  ⚠ DÉBORDEMENT" : ""}`);
      r.overflow.forEach(x => console.log("  OVF", x));
      if (w === 390) { r.smallText.forEach(x => console.log("  TXT", x)); r.smallTap.forEach(x => console.log("  TAP", x)); }
    }
    await p.close();
  }
  await ctx.close();
}
await b.close();
