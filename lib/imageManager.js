/**
 * Automated Image Management System
 * - Auto-generates alt text based on filename and context
 * - Converts images to WebP format
 * - Provides responsive layout utilities
 * - Cleans up original files after conversion
 */

import sharp from 'sharp';
import path from 'path';
import { promises as fs, existsSync } from 'fs';

// Alt text generation based on context and filename
function generateAltText(filename, context = '', carData = null) {
  // Remove file extension and clean filename
  const baseName = path.parse(filename).name;

  // Common replacements for better alt text
  const cleanName = baseName.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim().toLowerCase();

  // Context-based alt text generation
  if (context === 'car') {
    if (carData) {
      const brand = carData.brand || '';
      const model = carData.model || '';
      const year = carData.year || '';

      return `${brand} ${model} ${year} รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย`.trim();
    }
    return `รถมือสองคุณภาพดี - ครูหนึ่งรถสวย เชียงใหม่`;
  }

  if (context === 'hero' || context === 'banner') {
    return 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ ฟรีดาวน์ ผ่อนถูก มีรับประกัน';
  }

  if (context === 'logo') {
    return 'โลโก้ ครูหนึ่งรถสวย - ศูนย์รวมรถมือสองเชียงใหม่';
  }

  if (context === 'review' || context === 'customer') {
    return 'รีวิวลูกค้า ครูหนึ่งรถสวย - ประสบการณ์ซื้อรถมือสองเชียงใหม่';
  }

  // Generic alt text based on filename
  const keywords = {
    car: 'รถยนต์',
    auto: 'รถยนต์',
    vehicle: 'ยานพาหนะ',
    sedan: 'รถเก๋ง',
    suv: 'รถ SUV',
    pickup: 'รถกระบะ',
    hatchback: 'รถแฮทช์แบ็ก',
    engine: 'เครื่องยนต์',
    interior: 'ภายในรถ',
    exterior: 'ภายนอกรถ',
    dashboard: 'แดชบอร์ด',
    wheel: 'ล้อรถ',
    tire: 'ยางรถ',
  };

  let altText = cleanName;

  // Replace keywords with Thai equivalents
  Object.entries(keywords).forEach(([eng, thai]) => {
    if (cleanName.includes(eng)) {
      altText = altText.replace(new RegExp(eng, 'gi'), thai);
    }
  });

  return `${altText} - ครูหนึ่งรถสวย เชียงใหม่`.replace(/\s+/g, ' ').trim();
}

// Convert image to WebP format with optimization
async function convertToWebP(inputPath, outputDir = null, quality = 85) {
  try {
    const parsedPath = path.parse(inputPath);
    const outputPath = outputDir
      ? path.join(outputDir, `${parsedPath.name}.webp`)
      : path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    // Check if input file exists
    if (!existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    // Create output directory if it doesn't exist
    const outputDirPath = path.dirname(outputPath);
    await fs.mkdir(outputDirPath, { recursive: true });

    // Convert to WebP with optimization
    await sharp(inputPath)
      .webp({
        quality,
        effort: 6, // Maximum compression effort
        lossless: false,
      })
      .toFile(outputPath);

    console.log(`✅ Converted: ${inputPath} → ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Conversion failed: ${inputPath}`, error);
    throw error;
  }
}

// Generate responsive image sizes
async function generateResponsiveImages(
  inputPath,
  outputDir = null,
  sizes = [400, 800, 1200, 1920]
) {
  const results = [];
  const parsedPath = path.parse(inputPath);
  const baseOutputDir = outputDir || parsedPath.dir;

  for (const size of sizes) {
    try {
      const outputPath = path.join(baseOutputDir, `${parsedPath.name}-${size}w.webp`);

      await sharp(inputPath)
        .resize(size, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({
          quality: 85,
          effort: 6,
        })
        .toFile(outputPath);

      results.push({
        width: size,
        path: outputPath,
        url: outputPath.replace(/^.*\/public/, ''),
      });

      console.log(`✅ Generated responsive image: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}w:`, error);
    }
  }

  return results;
}

// Process all images in a directory
async function processDirectoryImages(dirPath, options = {}) {
  const {
    recursive = true,
    deleteOriginals = false,
    generateResponsive = false,
    quality = 85,
    context = '',
  } = options;

  const results = {
    converted: [],
    failed: [],
    cleaned: [],
  };

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && recursive) {
        // Process subdirectories recursively
        const subResults = await processDirectoryImages(fullPath, options);
        results.converted.push(...subResults.converted);
        results.failed.push(...subResults.failed);
        results.cleaned.push(...subResults.cleaned);
      } else if (entry.isFile()) {
        // Process image files
        const ext = path.extname(entry.name).toLowerCase();

        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
          try {
            let outputPath;

            if (generateResponsive) {
              const responsiveImages = await generateResponsiveImages(fullPath, dirPath);
              outputPath = responsiveImages[responsiveImages.length - 1]?.path;
            } else {
              outputPath = await convertToWebP(fullPath, dirPath, quality);
            }

            if (outputPath) {
              results.converted.push({
                original: fullPath,
                webp: outputPath,
                altText: generateAltText(entry.name, context),
              });

              // Delete original file if requested and conversion was successful
              if (deleteOriginals && existsSync(outputPath)) {
                await fs.unlink(fullPath);
                results.cleaned.push(fullPath);
                console.log(`🗑️ Deleted original: ${fullPath}`);
              }
            }
          } catch (error) {
            results.failed.push({
              file: fullPath,
              error: error.message,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Failed to process directory: ${dirPath}`, error);
  }

  return results;
}

// Utility function to get image metadata
async function getImageMetadata(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      aspectRatio: (metadata.width / metadata.height).toFixed(2),
    };
  } catch (error) {
    console.error(`Failed to get metadata for ${imagePath}:`, error);
    return null;
  }
}

// Clean up function to remove unused original images
async function cleanupOriginalImages(publicDir = 'public') {
  const results = {
    cleaned: [],
    errors: [],
  };

  try {
    const findOriginals = async dir => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await findOriginals(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const baseName = path.parse(entry.name).name;

          // Check if this is an original image with a WebP counterpart
          if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            const webpPath = path.join(dir, `${baseName}.webp`);

            if (existsSync(webpPath)) {
              try {
                await fs.unlink(fullPath);
                results.cleaned.push(fullPath);
                console.log(`🗑️ Cleaned up: ${fullPath}`);
              } catch (error) {
                results.errors.push({ file: fullPath, error: error.message });
              }
            }
          }
        }
      }
    };

    await findOriginals(publicDir);
  } catch (error) {
    console.error('Cleanup failed:', error);
  }

  return results;
}

// Export all functions
export {
  generateAltText,
  convertToWebP,
  generateResponsiveImages,
  processDirectoryImages,
  getImageMetadata,
  cleanupOriginalImages,
};
