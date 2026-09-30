// Vérifie les erreurs console / hydratation sur toutes les pages, mouvement normal et réduit
import { chromium } from "playwright";
import { existsSync } from "node:fs";
// Chromium de l'environnement si présent, sinon celui de Playwright (npx playwright install chromium)
const chrome = () => process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined);
const base = process.argv[2] ?? "http://localhost:3100";
const pages = ["/", "/coupes", "/equipe", "/reserver", "/infos", "/mentions-legales", "/confidentialite", "/nexiste-pas"];
const b = await chromium.launch({ executablePath: chrome() });
for (const mode of ["no-preference", "reduce"]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: mode });
  for (const path of pages) {
    const p = await ctx.newPage();
    const msgs = [];
    p.on("pageerror", (e) => msgs.push("PAGEERROR " + e.message.slice(0, 200)));
    p.on("console", (m) => { if (m.type() === "error" || (m.type() === "warning" && !/Clock|Reduced Motion/.test(m.text()))) msgs.push(m.type() + " " + m.text().slice(0, 200)); });
    await p.goto(base + path, { waitUntil: "networkidle" });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
    await p.waitForTimeout(500);
    console.log(mode, path, msgs.length ? msgs : "OK");
    await p.close();
  }
  await ctx.close();
}
await b.close();
