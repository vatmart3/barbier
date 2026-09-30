// Planche contact : node scripts/grid.mjs out.png cols scale img1 img2 ...
import sharp from "sharp";
const [,, out, cols = "2", scale = "0.5", ...imgs] = process.argv;
const metas = await Promise.all(imgs.map((i) => sharp(i).metadata()));
const w = Math.round(metas[0].width * +scale), h = Math.round(metas[0].height * +scale);
const rows = Math.ceil(imgs.length / +cols);
const composites = await Promise.all(imgs.map(async (img, i) => ({
  input: await sharp(img).resize(w, h, { fit: "contain", background: "#333" }).toBuffer(),
  left: (i % +cols) * (w + 8), top: Math.floor(i / +cols) * (h + 8),
})));
await sharp({ create: { width: +cols * (w + 8), height: rows * (h + 8), channels: 3, background: "#ff00ff" } }).composite(composites).png().toFile(out);
