/**
 * Generates the static dither mask (WebGL fallback) and the Open Graph image.
 *   npm run assets
 * Output: public/images/dither-mask.png, public/og.png (both are committed).
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

mkdirSync("public/images", { recursive: true });

/* ---- tileable dither mask: Bayer 8x8 threshold against a smooth periodic field ---- */
const N = 512;
const CELL = 2;
const G = N / CELL;
const bayer = (() => {
  let m = [[0]];
  while (m.length < 8) {
    const n = m.length;
    const next = Array.from({ length: n * 2 }, () => Array(n * 2).fill(0));
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const v = m[y][x] * 4;
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    m = next;
  }
  return m;
})();
const TAU = Math.PI * 2;
const px = Buffer.alloc(N * N * 4);
for (let gy = 0; gy < G; gy++) {
  for (let gx = 0; gx < G; gx++) {
    const u = gx / G;
    const v = gy / G;
    // integer periods keep the tile seamless
    const f =
      0.5 +
      0.22 * Math.sin(TAU * (2 * u + v)) +
      0.18 * Math.sin(TAU * (u - 3 * v) + 1.3) +
      0.12 * Math.sin(TAU * (4 * u + 2 * v) + 2.1);
    const t = (bayer[gy % 8][gx % 8] + 0.5) / 64;
    const on = f * 0.9 > t ? 255 : 0;
    for (let dy = 0; dy < CELL; dy++)
      for (let dx = 0; dx < CELL; dx++) {
        const i = ((gy * CELL + dy) * N + gx * CELL + dx) * 4;
        px[i] = px[i + 1] = px[i + 2] = 255;
        px[i + 3] = on;
      }
  }
}
await sharp(px, { raw: { width: N, height: N, channels: 4 } }).png({ compressionLevel: 9 }).toFile("public/images/dither-mask.png");

/* ---- Open Graph image (1200x630) ---- */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050505"/>
  <rect x="40" y="40" width="1120" height="550" rx="18" fill="none" stroke="#9D9994" stroke-opacity="0.35"/>
  <rect x="80" y="90" width="14" height="14" rx="7" fill="none" stroke="#9D9994" stroke-opacity="0.5"/>
  <rect x="104" y="90" width="14" height="14" rx="7" fill="none" stroke="#9D9994" stroke-opacity="0.5"/>
  <rect x="128" y="90" width="14" height="14" rx="7" fill="#700F12"/>
  <text x="80" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="108" fill="#F2EFE6">Aditya Patil</text>
  <text x="80" y="372" font-family="'DejaVu Sans Mono', Menlo, monospace" font-size="30" fill="#9D9994">aspiring ML engineer · PyTorch · Rust</text>
  <rect x="80" y="430" width="260" height="6" rx="3" fill="#700F12"/>
  <text x="80" y="520" font-family="'DejaVu Sans Mono', Menlo, monospace" font-size="26" fill="#F2EFE6">c0ba1t.is-a.dev</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("generated public/images/dither-mask.png and public/og.png");
