/**
 * Convert Hero Banner PNG images to WebP format
 * Run: node scripts/convert-herobanner-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const herobannerDir = path.join(__dirname, '..', 'public', 'herobanner');

// PNG files to convert
const pngFiles = [
  'cnxallcar.png',
  'kn2carbanner.png',
  'kn2carbanner2.png',
  'kn2carsbanner.png',
  '2.png',
  'team.png',
];

async function convertToWebP(filename) {
  const inputPath = path.join(herobannerDir, filename);
  const outputFilename = filename.replace('.png', '.webp');
  const outputPath = path.join(herobannerDir, outputFilename);

  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${filename} (WebP already exists)`);
    return;
  }

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSize = inputStats.size;

    await sharp(inputPath)
      .webp({
        quality: 85,
        effort: 6,
      })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const savings = ((inputSize - outputSize) / inputSize) * 100;

    console.log(`✅ ${filename}`);
    console.log(`   PNG: ${(inputSize / 1024).toFixed(2)} KB`);
    console.log(`   WebP: ${(outputSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings.toFixed(1)}%\n`);
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error.message);
  }
}

async function convertAll() {
  console.log('🎨 Converting Hero Banner Images to WebP...\n');

  for (const file of pngFiles) {
    const filePath = path.join(herobannerDir, file);
    if (fs.existsSync(filePath)) {
      await convertToWebP(file);
    } else {
      console.log(`⚠️  ${file} not found, skipping...`);
    }
  }

  console.log('✨ Conversion complete!');
}

convertAll();
