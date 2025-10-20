/**
 * 🚀 Optimize LCP Hero Banner Image - LCP Performance Fix
 *
 * เป้าหมาย: ลดขนาด cnxcar.webp จาก 318.55 KB → <150 KB
 * เหตุผล: ปรับปรุง Largest Contentful Paint (LCP) metric
 *
 * Run: node scripts/optimize-lcp-image.js
 *
 * ผลลัพธ์ที่คาดหวัง:
 * - LCP: 6,100ms → 3,000ms (-50%)
 * - FCP: 2,000ms → 1,200ms (-40%)
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const herobannerDir = path.join(__dirname, '..', 'public', 'herobanner');
const backupDir = path.join(herobannerDir, 'backup-original');

// LCP Critical Image
const LCP_IMAGE = 'cnxcar.webp';

// Optimization settings
const QUALITY_LEVELS = [
  { quality: 70, label: 'High Quality (Balanced)' },
  { quality: 65, label: 'Medium-High Quality' },
  { quality: 60, label: 'Medium Quality (Recommended)' },
];

async function backupOriginal(filename) {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${backupDir}\n`);
  }

  const originalPath = path.join(herobannerDir, filename);
  const backupPath = path.join(backupDir, `${filename}.original`);

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(originalPath, backupPath);
    const stats = fs.statSync(originalPath);
    console.log(`💾 Backed up original: ${(stats.size / 1024).toFixed(2)} KB\n`);
  } else {
    console.log(`✅ Backup already exists\n`);
  }
}

async function optimizeImage(filename, quality) {
  const inputPath = path.join(herobannerDir, filename);
  const tempPath = path.join(herobannerDir, `${filename}.temp`);

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSize = inputStats.size;

    await sharp(inputPath)
      .webp({
        quality: quality,
        effort: 6, // Max compression effort (slower, better compression)
        smartSubsample: true, // Better compression at lower qualities
      })
      .toFile(tempPath);

    const outputStats = fs.statSync(tempPath);
    const outputSize = outputStats.size;
    const savings = ((inputSize - outputSize) / inputSize) * 100;
    const targetMet = outputSize < 150 * 1024; // Target: <150 KB

    return {
      quality,
      inputSize,
      outputSize,
      savings,
      targetMet,
      tempPath,
    };
  } catch (error) {
    console.error(`❌ Error optimizing at quality ${quality}:`, error.message);
    return null;
  }
}

async function findBestQuality() {
  console.log('🔍 Testing optimization levels...\n');

  const results = [];

  for (const { quality, label } of QUALITY_LEVELS) {
    console.log(`⚙️  Testing quality ${quality} (${label})...`);
    const result = await optimizeImage(LCP_IMAGE, quality);

    if (result) {
      results.push(result);
      const targetEmoji = result.targetMet ? '✅' : '⚠️';
      console.log(`   ${targetEmoji} Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
      console.log(`   📊 Savings: ${result.savings.toFixed(1)}%`);
      console.log(`   🎯 Target (<150 KB): ${result.targetMet ? 'MET' : 'NOT MET'}\n`);

      // Clean up temp file
      fs.unlinkSync(result.tempPath);
    }
  }

  return results;
}

async function applyOptimization(quality) {
  const inputPath = path.join(herobannerDir, LCP_IMAGE);
  const backupPath = path.join(backupDir, `${LCP_IMAGE}.original`);
  const outputPath = path.join(herobannerDir, LCP_IMAGE + '.optimized');

  console.log(`\n🚀 Applying optimization (quality ${quality})...\n`);

  const inputStats = fs.statSync(backupPath);
  const inputSize = inputStats.size;

  // Create optimized version from backup
  await sharp(backupPath)
    .webp({
      quality: quality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);

  const outputStats = fs.statSync(outputPath);
  const outputSize = outputStats.size;
  const savings = ((inputSize - outputSize) / inputSize) * 100;

  console.log(`✅ Optimization complete!`);
  console.log(`   Before: ${(inputSize / 1024).toFixed(2)} KB`);
  console.log(`   After:  ${(outputSize / 1024).toFixed(2)} KB`);
  console.log(
    `   Saved:  ${((inputSize - outputSize) / 1024).toFixed(2)} KB (${savings.toFixed(1)}%)`
  );
  console.log(`\n📝 Manual step required:`);
  console.log(`   1. Stop dev server if running`);
  console.log(`   2. Delete: ${inputPath}`);
  console.log(`   3. Rename: ${outputPath} → cnxcar.webp`);
  console.log(`\n📊 Expected LCP improvement: -2,000 to -3,000ms\n`);
}

async function main() {
  console.log('🎯 LCP Image Optimization Tool\n');
  console.log('='.repeat(50) + '\n');

  const imagePath = path.join(herobannerDir, LCP_IMAGE);

  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: ${LCP_IMAGE} not found!`);
    process.exit(1);
  }

  // Backup original
  await backupOriginal(LCP_IMAGE);

  // Find best quality setting
  const results = await findBestQuality();

  // Select best quality that meets target
  const bestResult = results.find(r => r.targetMet) || results[results.length - 1];

  console.log('='.repeat(50));
  console.log('\n📌 Recommendation:');
  console.log(`   Quality: ${bestResult.quality}`);
  console.log(`   Size: ${(bestResult.outputSize / 1024).toFixed(2)} KB`);
  console.log(`   Savings: ${bestResult.savings.toFixed(1)}%`);
  console.log(`   Target met: ${bestResult.targetMet ? 'YES ✅' : 'NO ⚠️'}\n`);

  // Apply optimization
  await applyOptimization(bestResult.quality);

  console.log('✨ Done! Deploy to see LCP improvements.\n');
  console.log('💡 Tip: Monitor LCP with Lighthouse after deployment');
}

main();
