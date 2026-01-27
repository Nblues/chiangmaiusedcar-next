import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const inputPath = path.join(projectRoot, 'public', 'herobanner', 'kn10.webp');
const outDir = path.join(projectRoot, 'public', 'herobanner');

const widths = [480, 640, 828, 1024, 1280, 1400];
const quality = 72;

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await fileExists(inputPath))) {
    throw new Error(`Input not found: ${inputPath}`);
  }

  await fs.mkdir(outDir, { recursive: true });

  const img = sharp(inputPath, { failOn: 'none' });
  const meta = await img.metadata();
  console.log(`kn10.webp: ${meta.width}x${meta.height} format=${meta.format}`);

  for (const w of widths) {
    const outPath = path.join(outDir, `kn10-${w}w.webp`);

    // Avoid upscaling
    if (meta.width && w > meta.width) {
      console.log(`skip ${w}w (would upscale)`);
      continue;
    }

    await sharp(inputPath, { failOn: 'none' })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outPath);

    const stat = await fs.stat(outPath);
    console.log(`wrote ${path.relative(projectRoot, outPath)} (${stat.size} bytes)`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
