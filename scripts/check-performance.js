#!/usr/bin/env node

/**
 * Performance monitoring script for production builds
 * Usage: node scripts/check-performance.js
 */

const fs = require('fs');
const path = require('path');

function checkBuildPerformance() {
  console.log('🚀 Checking build performance...\n');

  // Check .next folder size
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('❌ .next directory not found. Run "pnpm build" first.');
    return;
  }

  // Read build manifest
  const buildManifest = path.join(nextDir, 'build-manifest.json');
  if (fs.existsSync(buildManifest)) {
    const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
    
    console.log('📦 Bundle Information:');
    console.log('├── Pages:');
    Object.entries(manifest.pages).forEach(([page, files]) => {
      const totalSize = files.reduce((acc, file) => {
        const filePath = path.join(nextDir, 'static', file);
        if (fs.existsSync(filePath)) {
          return acc + fs.statSync(filePath).size;
        }
        return acc;
      }, 0);
      
      console.log(`│   ├── ${page}: ${(totalSize / 1024).toFixed(2)} KB`);
    });
  }

  // Check static file sizes
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('\n📊 Static Assets:');
    
    // Check chunks
    const chunksDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const chunks = fs.readdirSync(chunksDir);
      let totalChunkSize = 0;
      
      chunks.forEach(chunk => {
        const chunkPath = path.join(chunksDir, chunk);
        const stats = fs.statSync(chunkPath);
        totalChunkSize += stats.size;
        
        if (stats.size > 500 * 1024) { // > 500KB
          console.log(`│   ⚠️  Large chunk: ${chunk} (${(stats.size / 1024).toFixed(2)} KB)`);
        }
      });
      
      console.log(`│   Total chunks size: ${(totalChunkSize / 1024 / 1024).toFixed(2)} MB`);
    }

    // Check CSS
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      let totalCssSize = 0;
      
      cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        totalCssSize += stats.size;
      });
      
      console.log(`│   Total CSS size: ${(totalCssSize / 1024).toFixed(2)} KB`);
    }
  }

  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('│   ✅ Use next/image for all images');
  console.log('│   ✅ Enable gzip/brotli compression on server');
  console.log('│   ✅ Use dynamic imports for heavy components');
  console.log('│   ✅ Optimize bundle with tree shaking');
  console.log('│   ✅ Use ISR for static content with updates');
  console.log('│   ✅ Monitor Core Web Vitals in production');

  console.log('\n🎯 Next Steps:');
  console.log('│   • Run "pnpm analyze" to see detailed bundle analysis');
  console.log('│   • Deploy to Vercel for automatic optimizations');
  console.log('│   • Monitor with Vercel Analytics or similar tools');
  
  console.log('\n✅ Performance check completed!');
}

if (require.main === module) {
  checkBuildPerformance();
}

module.exports = { checkBuildPerformance };
