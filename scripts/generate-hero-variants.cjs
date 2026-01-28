/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureHeroVariants({
  inputRelative,
  outputDirRelative,
  baseName,
  widths,
  quality = 72,
}) {
  const repoRoot = path.join(__dirname, '..');
  const inputPath = path.join(repoRoot, inputRelative);
  const outputDir = path.join(repoRoot, outputDirRelative);

  if (!(await fileExists(inputPath))) {
    console.warn(`[hero-variants] Skip: missing input ${inputRelative}`);
    return { generated: 0, skipped: widths.length };
  }

  await fs.promises.mkdir(outputDir, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const width of widths) {
    const outName = `${baseName}-${width}w.webp`;
    const outPath = path.join(outputDir, outName);

    if (await fileExists(outPath)) {
      skipped += 1;
      continue;
    }

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outPath);

    generated += 1;
  }

  console.log(
    `[hero-variants] ${baseName}: generated=${generated} skipped=${skipped} (quality=${quality})`
  );

  return { generated, skipped };
}

async function main() {
  // All-cars hero: create responsive variants at build time so we don't need to commit binaries.
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'cnxallcar.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'cnxallcar',
    widths: [480, 640, 828, 1024, 1400],
    quality: 72,
  });

  // Promotion hero (also used on /promotion):
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'cnxcontact.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'cnxcontact',
    widths: [480, 640, 828, 1024, 1400],
    quality: 72,
  });

  // Contact page hero:
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'contact.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'contact',
    widths: [480, 640, 828, 1024, 1400],
    quality: 72,
  });

  // About page hero:
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'team.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'team',
    widths: [480, 640, 828, 1024, 1400],
    quality: 72,
  });

  // Payment calculator hero:
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'paymentcalculator.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'paymentcalculator',
    widths: [480, 640, 828, 1024, 1400],
    quality: 72,
  });

  // Sell-car wide banner:
  await ensureHeroVariants({
    inputRelative: path.join('public', 'herobanner', 'chiangmaiusedcars.webp'),
    outputDirRelative: path.join('public', 'herobanner'),
    baseName: 'chiangmaiusedcars',
    widths: [640, 828, 1024, 1200, 1400, 1920],
    quality: 72,
  });
}

main().catch(err => {
  console.error('[hero-variants] Failed:', err);
  process.exitCode = 1;
});
