// Interactions clés : menu, fidélité, configurateur, avant/après clavier, FAQ, question
import { chromium } from "playwright";
import { existsSync } from "node:fs";
// Chromium de l'environnement si présent, sinon celui de Playwright (npx playwright install chromium)
const chrome = () => process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined);
const base = process.argv[2] ?? "http://localhost:3200";
const out = "/tmp/claude-0/shots";
const b = await chromium.launch({ executablePath: chrome() });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { sessionStorage.setItem("dg-seen", "1"); localStorage.setItem("dg-consent", '{"mesure":false}'); });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await p.goto(base + "/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Ouvrir le menu" }).click();
await p.waitForTimeout(900);
await p.screenshot({ path: `${out}/i-menu.png` });
console.log("menu focus :", await p.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30)));
await p.keyboard.press("Escape");
await p.waitForTimeout(700);
console.log("menu fermé :", await p.evaluate(() => !document.querySelector("#menu-principal")?.hasAttribute("data-ouvert")));
// Fidélité
const tamp = p.getByRole("button", { name: "Tamponner" });
await tamp.scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
for (let i = 0; i < 10; i++) { if (await tamp.isVisible()) await tamp.click(); await p.waitForTimeout(150); }
await p.waitForTimeout(600);
console.log("fidélité :", await p.locator("text=Coupe offerte").count() > 0 ? "coupe offerte affichée" : "KO");
await p.screenshot({ path: `${out}/i-fid.png` });
// Avant / après clavier
const slider = p.getByRole("slider", { name: /Comparer/ });
await slider.scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
await slider.focus();
await p.keyboard.press("Home");
const v0 = await slider.getAttribute("aria-valuenow");
await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight");
console.log("slider :", v0, "→", await slider.getAttribute("aria-valuenow"));
// Configurateur
await p.goto(base + "/coupes?coupe=fade-haut#configurateur", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.getByText("Long", { exact: true }).click();
await p.waitForTimeout(600);
await p.getByRole("tab", { name: /La barbe/ }).click();
await p.getByText("Rasage complet", { exact: true }).click();
await p.waitForTimeout(900);
console.log("configurateur total :", await p.locator("text=Total").locator("..").innerText().catch(() => "?"));
await p.screenshot({ path: `${out}/i-conf.png` });
await p.getByRole("button", { name: /Réserver cette coupe/ }).click();
await p.waitForURL(/reserver/);
console.log("URL :", p.url());
// FAQ + question
await p.goto(base + "/infos", { waitUntil: "networkidle" });
const q = p.locator("summary").first();
await q.scrollIntoViewIfNeeded(); await q.click(); await p.waitForTimeout(600);
console.log("FAQ ouverte :", await p.locator("details").first().evaluate((d) => d.open));
await p.getByRole("button", { name: /Envoyer la question/ }).click();
await p.waitForTimeout(300);
console.log("erreurs question :", (await p.locator('[role="alert"]').allInnerTexts()).filter(Boolean));
await p.fill("#q-nom", "Samir"); await p.fill("#q-contact", "06 11 22 33 44"); await p.fill("#q-message", "Vous prenez les cheveux crépus le samedi ?");
await p.locator('input[name="consentement"]').check();
await p.getByRole("button", { name: /Envoyer la question/ }).click();
await p.waitForSelector("text=Question reçue", { timeout: 8000 });
console.log("question : succès");
await p.screenshot({ path: `${out}/i-q.png` });
await b.close();
