// Writes public/images/bubbard-cube-face.png: the B from the BUBBARD logo, unprojected off the cube's
// right face into a flat square, white B on black (a luminance mask). The landing loader builds the logo
// as a real CSS cube and lays this on that face, so at rest it lines up with the logo exactly.
// Run by hand after the logo changes: node scripts/cube-face.mjs
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const { data, info } = await sharp(path.join(root, "public/images/bubbard-logo.png"))
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

// The hexagon: centred at the cube's near corner, its flat sides 240px apart, so circumradius 120 / cos 30°.
const centre = [192.5, 181.5];
const r = 120 / Math.cos(Math.PI / 6);
// The right face's edges out of the near corner: up-right to the hexagon's upper-right vertex, and straight down.
const across = [120, -r / 2];
const down = [0, r];

const at = (x, y) => data[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
const sample = (x, y) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  return (
    at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) + at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy
  );
};

const size = 256;
const out = Buffer.alloc(size * size);
for (let j = 0; j < size; j++) {
  for (let i = 0; i < size; i++) {
    const s = (i + 0.5) / size;
    const t = (j + 0.5) / size;
    // Only the B's quarter of the face: elsewhere the sample would catch the black past the rounded corners.
    if (s < 0.3 || t < 0.2) continue;
    out[j * size + i] = 255 - Math.round(sample(centre[0] + s * across[0] + t * down[0], centre[1] + s * across[1] + t * down[1]));
  }
}

await sharp(out, { raw: { width: size, height: size, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public/images/bubbard-cube-face.png"));
