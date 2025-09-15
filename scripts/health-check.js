#!/usr/bin/env node

/**
 * Final System Health Check Script
 * ตรวจสอบความพร้อมของระบบทั้งหมด
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 กำลังตรวจสอบสุขภาพระบบ...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
  results: [],
};

function check(name, condition, level = 'error') {
  const result = {
    name,
    status: condition ? '✅' : level === 'warning' ? '⚠️' : '❌',
    level,
  };

  if (condition) {
    checks.passed++;
  } else if (level === 'warning') {
    checks.warnings++;
  } else {
    checks.failed++;
  }

  checks.results.push(result);
  return condition;
}

// 1. ตรวจสอบไฟล์สำคัญ
check('next.config.js exists', fs.existsSync('next.config.js'));
check('package.json exists', fs.existsSync('package.json'));
check('tsconfig.json exists', fs.existsSync('tsconfig.json'));
check('.env.local exists', fs.existsSync('.env.local'));

// 2. ตรวจสอบ Build artifacts
check('Build directory exists', fs.existsSync('.next'));
check('Build completed', fs.existsSync('.next/BUILD_ID'));

// 3. ตรวจสอบไฟล์ที่ไม่ควรมี
check('No corrupted service-areas.jsx', !fs.existsSync('pages/cars/service-areas.jsx'));

// 4. ตรวจสอบ robots.txt และ sitemap
const robotsContent = fs.existsSync('public/robots.txt')
  ? fs.readFileSync('public/robots.txt', 'utf-8')
  : '';

check(
  'robots.txt blocks internal tools',
  robotsContent.includes('/keyword-audit') &&
    robotsContent.includes('/api-dashboard') &&
    robotsContent.includes('/license')
);

check('Sitemap exists', fs.existsSync('public/sitemap.xml'));

// 5. ตรวจสอบ Security
const nextConfigContent = fs.existsSync('next.config.js')
  ? fs.readFileSync('next.config.js', 'utf-8')
  : '';

check('CSP headers configured', nextConfigContent.includes('Content-Security-Policy'));
check('Security headers configured', nextConfigContent.includes('X-Frame-Options'));

// 6. ตรวจสอบ Performance
check('SWC minification enabled', nextConfigContent.includes('swcMinify: true'));
check('Image optimization configured', nextConfigContent.includes('remotePatterns'));

// 7. ตรวจสอบ Dependencies
const packageJson = fs.existsSync('package.json')
  ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  : {};

check('Next.js version OK', packageJson.dependencies?.next?.includes('14.2.5') || false);
check('React version OK', packageJson.dependencies?.react?.includes('18.') || false);

// 8. ตรวจสอบ Environment
check(
  'Build scripts configured',
  packageJson.scripts?.build?.includes('cross-env NODE_ENV=production')
);
check('Test scripts configured', packageJson.scripts?.['test:build'] !== undefined);

// แสดงผลลัพธ์
console.log('='.repeat(60));
console.log('📊 ผลการตรวจสอบสุขภาพระบบ');
console.log('='.repeat(60));

checks.results.forEach(result => {
  console.log(`${result.status} ${result.name}`);
});

console.log('\n' + '='.repeat(60));
console.log(`✅ ผ่าน: ${checks.passed} รายการ`);
console.log(`⚠️  คำเตือน: ${checks.warnings} รายการ`);
console.log(`❌ ล้มเหลว: ${checks.failed} รายการ`);

const healthScore = Math.round(
  (checks.passed / (checks.passed + checks.failed + checks.warnings)) * 100
);
console.log(`\n🏆 คะแนนสุขภาพระบบ: ${healthScore}%`);

if (healthScore >= 95) {
  console.log('🎉 ระบบพร้อมใช้งาน 100% เต็มประสิทธิภาพ!');
} else if (healthScore >= 85) {
  console.log('✅ ระบบอยู่ในสภาพดี พร้อมใช้งาน');
} else if (healthScore >= 70) {
  console.log('⚠️  ระบบใช้งานได้ แต่ควรปรับปรุง');
} else {
  console.log('❌ ระบบมีปัญหา ต้องแก้ไขก่อนใช้งาน');
}

console.log('='.repeat(60));

// สร้าง health report
const report = {
  timestamp: new Date().toISOString(),
  healthScore,
  summary: {
    passed: checks.passed,
    warnings: checks.warnings,
    failed: checks.failed,
    total: checks.results.length,
  },
  details: checks.results,
};

fs.writeFileSync('health-report.json', JSON.stringify(report, null, 2));
console.log('📄 รายงานถูกบันทึกใน health-report.json');

process.exit(checks.failed > 0 ? 1 : 0);
