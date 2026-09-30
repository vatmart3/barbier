// Placeholders photo art-dirigés (noir & blanc, fort contraste, grain) — à remplacer
// par de vraies photos (voir ASSETS.md). node scripts/placeholders.mjs
import sharp from "sharp";

const grain = async (w, h, amount = 34) => {
  const buf = Buffer.alloc(w * h);
  let s = 12345;
  for (let i = 0; i < buf.length; i++) {
    s = (s * 16807) % 2147483647;
    buf[i] = 128 + ((s / 2147483647 - 0.5) * amount);
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
};

const chaise = (x, s) => `
  <g transform="translate(${x} 0) scale(${s})" fill="#050505">
    <rect x="-70" y="420" width="140" height="26" rx="6"/>
    <rect x="-86" y="300" width="172" height="130" rx="18"/>
    <rect x="-70" y="120" width="140" height="200" rx="22"/>
    <rect x="-44" y="80" width="88" height="46" rx="12"/>
    <rect x="-104" y="330" width="24" height="70" rx="8"/>
    <rect x="80" y="330" width="24" height="70" rx="8"/>
    <rect x="-10" y="446" width="20" height="120"/>
    <ellipse cx="0" cy="580" rx="110" ry="18"/>
    <rect x="-60" y="500" width="120" height="14" rx="5"/>
  </g>`;

const salon = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1600 1100">
  <defs>
    <radialGradient id="lum" cx="0.78" cy="0.25" r="0.9"><stop offset="0" stop-color="#e9e4da"/><stop offset="0.35" stop-color="#8a8d90"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient>
    <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <pattern id="carreaux" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)"><rect width="60" height="60" fill="#202020"/><rect x="60" y="60" width="60" height="60" fill="#202020"/></pattern>
  </defs>
  <rect width="1600" height="1100" fill="url(#lum)"/>
  ${[160, 640, 1120].map((x) => `<rect x="${x}" y="120" width="330" height="430" fill="#2a2c2e" stroke="#0a0a0a" stroke-width="18"/><rect x="${x + 20}" y="140" width="290" height="390" fill="#6d7073" opacity="0.55"/>`).join("")}
  <rect x="0" y="560" width="1600" height="40" fill="#0d0d0d"/>
  <rect x="0" y="690" width="1600" height="410" fill="url(#sol)"/>
  <rect x="0" y="690" width="1600" height="410" fill="url(#carreaux)" opacity="0.6"/>
  <g transform="translate(0 150)">${chaise(325, 1)}${chaise(805, 1)}${chaise(1285, 1)}</g>
  <rect x="1440" y="40" width="46" height="330" rx="20" fill="#d9dde0"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="1440" y="${60 + i * 34}" width="46" height="14" fill="#111" transform="skewY(-18)" transform-origin="1463 ${60 + i * 34}"/>`).join("")}
</svg>`;

const devanture = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6d2ca"/><stop offset="1" stop-color="#9a9da0"/></linearGradient>
    <linearGradient id="vitre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3c3e"/><stop offset="0.5" stop-color="#101010"/><stop offset="1" stop-color="#2c2e30"/></linearGradient>
    <pattern id="pierre" width="90" height="46" patternUnits="userSpaceOnUse"><rect width="90" height="46" fill="#b9b5ad"/><path d="M0 45.5H90M45 0V23M0 23H90M89.5 23V46" stroke="#8d8a84" stroke-width="2"/></pattern>
  </defs>
  <rect width="1600" height="1000" fill="url(#pierre)"/>
  <rect x="180" y="150" width="1240" height="120" fill="#0b0b0b"/>
  <text x="800" y="245" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="104" letter-spacing="18" fill="#f2ede4">DÉGRADÉ</text>
  <rect x="180" y="300" width="1240" height="560" fill="#0b0b0b"/>
  <rect x="210" y="330" width="760" height="500" fill="url(#vitre)"/>
  <rect x="1010" y="330" width="380" height="530" fill="#171717"/>
  <rect x="1330" y="580" width="16" height="60" fill="#c3c8cc"/>
  <path d="M210 330L560 330L260 830L210 830Z" fill="#fff" opacity="0.08"/>
  <text x="590" y="600" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" letter-spacing="8" fill="#e7e0d3" opacity="0.8">BARBIER · SÈTE</text>
  <rect x="120" y="120" width="40" height="300" rx="18" fill="#e7e0d3"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="120" y="${140 + i * 34}" width="40" height="13" fill="#111" transform="skewY(-18)" transform-origin="140 ${140 + i * 34}"/>`).join("")}
  <rect x="0" y="860" width="1600" height="140" fill="#2a2a2a"/>
  <rect x="0" y="860" width="1600" height="10" fill="#555"/>
</svg>`;

async function faire(nom, svg, w, h) {
  const base = await sharp(Buffer.from(svg(w, h))).greyscale().linear(1.35, -30).toBuffer();
  const img = sharp(base).composite([{ input: await grain(w, h), blend: "overlay" }]);
  await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`public/images/${nom}.jpg`);
  console.log(nom, "ok");
}
await faire("salon-fauteuils", salon, 1600, 1100);
await faire("devanture-grand-rue", devanture, 1600, 1000);
