// Writes src/data/blur.json: a tiny blurred WebP data URL for every image in
// public/images and public/media, keyed by its public path. Media frames show
// it, blurred, until the real image or clip has loaded. Runs before dev/build.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const out = path.join(root, "src/data/blur.json");

// Sorted, so the file comes out the same whatever order the file system lists a folder in.
async function* images(dir) {
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* images(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield full;
  }
}

const blur = {};
for (const dir of ["images", "media"]) {
  for await (const file of images(path.join(pub, dir))) {
    const buf = await sharp(file).resize(24, 24, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    blur[`/${path.relative(pub, file).split(path.sep).join("/")}`] = `data:image/webp;base64,${buf.toString("base64")}`;
  }
}

await writeFile(out, `${JSON.stringify(blur, null, 1)}\n`);
console.log(`blur: ${Object.keys(blur).length} placeholders → ${path.relative(root, out)}`);
