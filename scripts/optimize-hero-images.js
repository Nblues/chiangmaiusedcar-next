/**
 * Optimize Hero Images - Resize และสร้าง responsive versions
 * รันด้วย: node scripts/optimize-hero-images.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// กำหนดขนาดที่ต้องการสำหรับ hero images
const HERO_SIZES = [
  { width: 640, suffix: '-640w' },
  { width: 1024, suffix: '-1024w' },
  { width: 1400, suffix: '-1400w' }, // ขนาดสูงสุดที่ใช้จริง
];

// กำหนดขนาดสำหรับ logo
const LOGO_SIZE = 128; // ขนาดสูงสุด 128px (แสดงที่ 64px = 2x DPI)

async function optimizeHeroImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));

  console.log(`\n📸 Processing: ${filename}`);

  try {
    // อ่านข้อมูลรูปภาพ
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(
      `   Original: ${metadata.width}x${metadata.height} (${(metadata.size / 1024).toFixed(2)} KB)`
    );

    // สร้าง responsive versions
    for (const size of HERO_SIZES) {
      const outputPath = path.join(outputDir, `${filename}${size.suffix}.webp`);

      await image
        .clone()
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`   ✅ Created: ${size.width}w (${(stats.size / 1024).toFixed(2)} KB)`);
    }

    // สร้างไฟล์ต้นฉบับที่ optimize แล้ว (ไม่เปลี่ยนชื่อ)
    // Note: Sharp cannot read+write the same file path. Write to temp then replace.
    const originalOutput = path.join(outputDir, `${filename}.webp`);
    const tempOutput = path.join(outputDir, `${filename}.tmp.webp`);

    await image
      .clone()
      .resize(1400, null, {
        // จำกัดความกว้างสูงสุด 1400px
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(tempOutput);

    fs.copyFileSync(tempOutput, originalOutput);
    fs.unlinkSync(tempOutput);

    const stats = fs.statSync(originalOutput);
    console.log(`   ✅ Optimized original: (${(stats.size / 1024).toFixed(2)} KB)`);
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

async function optimizeLogo(inputPath, outputPath) {
  console.log(`\n🎨 Optimizing logo: ${path.basename(inputPath)}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(
      `   Original: ${metadata.width}x${metadata.height} (${(metadata.size / 1024).toFixed(2)} KB)`
    );

    await image
      .resize(LOGO_SIZE, LOGO_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(
      `   ✅ Optimized: ${LOGO_SIZE}x${LOGO_SIZE} (${(stats.size / 1024).toFixed(2)} KB)`
    );
  } catch (error) {
    console.error(`   ❌ Error optimizing logo:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  const herobannerDir = path.join(__dirname, '..', 'public', 'herobanner');
  const logoDir = path.join(__dirname, '..', 'public', 'logo');

  // Optimize hero banner
  const heroImagePath = path.join(herobannerDir, 'cnxcar.webp');
  if (fs.existsSync(heroImagePath)) {
    await optimizeHeroImage(heroImagePath, herobannerDir);
  } else {
    console.log('⚠️  cnxcar.webp not found');
  }

  // Optimize logo
  const logoPath = path.join(logoDir, 'logo_main.webp');
  const logoOutputPath = path.join(logoDir, 'logo_main_optimized.webp');
  if (fs.existsSync(logoPath)) {
    await optimizeLogo(logoPath, logoOutputPath);
  } else {
    console.log('⚠️  logo_main.webp not found');
  }

  console.log('\n✨ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Check the optimized images in public/herobanner/');
  console.log('2. Update A11yImage component to use responsive srcSet');
  console.log('3. Test on mobile and desktop devices');
}

main().catch(console.error);
