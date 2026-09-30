// Génère favicon.ico, apple-icon.png et icônes PWA à partir de src/app/icon.svg
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const svg = readFileSync("src/app/icon.svg");
mkdirSync("public/icons", { recursive: true });
const png = (s) => sharp(svg, { density: 512 }).resize(s, s).png().toBuffer();
writeFileSync("src/app/apple-icon.png", await png(180));
writeFileSync("public/icons/icon-192.png", await png(192));
writeFileSync("public/icons/icon-512.png", await png(512));
// Maskable : marge de sécurité de 20 %
const inner = await sharp(svg, { density: 512 }).resize(360, 360).png().toBuffer();
writeFileSync("public/icons/icon-maskable-512.png", await sharp({ create: { width: 512, height: 512, channels: 4, background: "#111111" } }).composite([{ input: inner, left: 76, top: 76 }]).png().toBuffer());
// ICO multi-tailles (PNG embarqués)
const sizes = [16, 32, 48];
const imgs = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(imgs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += imgs[i].length;
  return e;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...dir, ...imgs]));
console.log("icônes ok");
