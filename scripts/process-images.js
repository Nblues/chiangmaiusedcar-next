#!/usr/bin/env node

/**
 * Image Processing Script
 * Converts all images to WebP format and generates responsive variants
 * Usage: node scripts/process-images.js [options]
 */

const path = require('path');
const { processDirectoryImages, cleanupOriginalImages } = require('../lib/imageManager');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    recursive: true,
    deleteOriginals: args.includes('--delete-originals'),
    generateResponsive: args.includes('--responsive'),
    quality: 85,
    context: '',
  };

  console.log('🚀 Starting image processing...');
  console.log('Options:', options);

  const publicDir = path.join(process.cwd(), 'public');
  const directories = [
    { path: path.join(publicDir, 'images'), context: 'car' },
    { path: path.join(publicDir, 'herobanner'), context: 'hero' },
    { path: path.join(publicDir, 'logo'), context: 'logo' },
    { path: path.join(publicDir, 'reviewers'), context: 'review' },
    { path: path.join(publicDir, 'bank'), context: 'bank' },
  ];

  const allResults = {
    converted: [],
    failed: [],
    cleaned: [],
  };

  // Process each directory
  for (const dir of directories) {
    console.log(`\n📁 Processing directory: ${dir.path}`);
    try {
      const results = await processDirectoryImages(dir.path, {
        ...options,
        context: dir.context,
      });

      allResults.converted.push(...results.converted);
      allResults.failed.push(...results.failed);
      allResults.cleaned.push(...results.cleaned);

      console.log(`✅ Converted: ${results.converted.length} images`);
      console.log(`❌ Failed: ${results.failed.length} images`);
      console.log(`🗑️ Cleaned: ${results.cleaned.length} files`);
    } catch (error) {
      console.error(`❌ Failed to process ${dir.path}:`, error.message);
    }
  }

  // Summary
  console.log('\n📊 PROCESSING SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Total converted: ${allResults.converted.length}`);
  console.log(`❌ Total failed: ${allResults.failed.length}`);
  console.log(`🗑️ Total cleaned: ${allResults.cleaned.length}`);

  if (allResults.failed.length > 0) {
    console.log('\n❌ FAILED FILES:');
    allResults.failed.forEach(failure => {
      console.log(`  - ${failure.file}: ${failure.error}`);
    });
  }

  if (allResults.converted.length > 0) {
    console.log('\n✅ CONVERTED FILES:');
    allResults.converted.forEach(conversion => {
      console.log(`  - ${path.basename(conversion.original)} → ${path.basename(conversion.webp)}`);
      console.log(`    Alt text: ${conversion.altText}`);
    });
  }

  console.log('\n🎉 Image processing complete!');
}

// Additional cleanup function
async function runCleanup() {
  console.log('🧹 Running cleanup of original images...');
  const results = await cleanupOriginalImages();

  console.log(`🗑️ Cleaned up ${results.cleaned.length} original images`);
  if (results.errors.length > 0) {
    console.log(`❌ Cleanup errors: ${results.errors.length}`);
    results.errors.forEach(error => {
      console.log(`  - ${error.file}: ${error.error}`);
    });
  }
}

// Handle command line arguments
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'cleanup') {
    runCleanup().catch(console.error);
  } else {
    main().catch(console.error);
  }
}

module.exports = { main, runCleanup };
