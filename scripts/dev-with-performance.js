#!/usr/bin/env node

/**
 * Quick start script for development with performance optimizations
 * Usage: node scripts/dev-with-performance.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting optimized development server...\n');

// Check if .env.local exists
const fs = require('fs');
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found. Creating from example...');
  
  const examplePath = path.join(process.cwd(), '.env.local.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env.local from example');
  } else {
    // Create basic .env.local
    const envContent = `# Development Environment Variables
NODE_ENV=development
REVALIDATE_SECRET=dev-secret-key-change-this

# Optional: Enable analytics in development
# NEXT_PUBLIC_VERCEL_ANALYTICS=true
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created basic .env.local');
  }
  console.log('📝 Please review .env.local and update values as needed\n');
}

// Performance tips
console.log('💡 Performance Tips:');
console.log('│   • Use "pnpm analyze" to check bundle sizes');
console.log('│   • Use "pnpm check-performance" after builds');
console.log('│   • Test cache revalidation with /api/revalidate');
console.log('│   • Monitor Core Web Vitals in production\n');

// Start development server
console.log('🔥 Starting Next.js development server...\n');

const devProcess = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
  process.exit(1);
});

devProcess.on('close', (code) => {
  console.log(`\n📊 Development server exited with code ${code}`);
  
  if (code === 0) {
    console.log('🎯 Want to check performance?');
    console.log('│   Run: node scripts/check-performance.js');
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  devProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  devProcess.kill('SIGTERM');
});
