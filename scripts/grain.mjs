// Génère public/textures/grain.png : bruit monochrome 180×180, tuilable.
import sharp from "sharp";
const S = 180;
const buf = Buffer.alloc(S * S * 4);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < S * S; i++) {
  const v = Math.floor(rnd() * 255);
  buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
  buf[i * 4 + 3] = 255;
}
await sharp(buf, { raw: { width: S, height: S, channels: 4 } }).png({ compressionLevel: 9, palette: true, colors: 32 }).toFile("public/textures/grain.png");
console.log("grain ok");
