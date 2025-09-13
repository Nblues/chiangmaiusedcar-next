/**
 * Favicon Generator Script
 * สคริปต์สำหรับสร้าง favicon หลายขนาดจากไฟล์ต้นฉบับ
 *
 * ขั้นตอนการใช้งาน:
 * 1. แก้ไขไฟล์ logo_main.png ให้ไม่มีขอบสีแดง
 * 2. รันสคริปต์นี้: node scripts/generate-favicon.js
 *
 * ต้องติดตั้ง: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// ตรวจสอบว่ามี sharp หรือไม่
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('❌ กรุณาติดตั้ง sharp ก่อน: npm install sharp');
  console.log('💡 หรือใช้เครื่องมือออนไลน์: https://favicon.io/favicon-generator/');
  process.exit(1);
}

const inputFile = path.join(__dirname, '../public/logo/logo_main.png');
const outputDir = path.join(__dirname, '../public');

// ขนาด favicon ที่ต้องการ
const sizes = [16, 32, 48, 96, 144, 192, 256, 384];

async function generateFavicons() {
  try {
    console.log('🎨 เริ่มสร้าง favicon...');

    // ตรวจสอบไฟล์ต้นฉบับ
    if (!fs.existsSync(inputFile)) {
      console.log(`❌ ไม่พบไฟล์: ${inputFile}`);
      console.log('💡 กรุณาแก้ไขไฟล์ logo_main.png ให้ไม่มีขอบสีแดงก่อน');
      return;
    }

    // สร้าง favicon แต่ละขนาด
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `favicon-${size}.png`);

      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // โปร่งใส
        })
        .png()
        .toFile(outputFile);

      console.log(`✅ สร้าง favicon-${size}.png แล้ว`);
    }

    // สร้าง favicon.png (ขนาดหลัก)
    await sharp(inputFile)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));

    console.log('✅ สร้าง favicon.png แล้ว');

    // สร้าง favicon.ico (สำหรับเบราว์เซอร์เก่า)
    // หมายเหตุ: sharp ไม่รองรับ .ico โดยตรง ต้องใช้เครื่องมืออื่น
    console.log('📝 หมายเหตุ: กรุณาแปลง favicon.png เป็น favicon.ico ด้วยเครื่องมือออนไลน์');
    console.log('🔗 แนะนำ: https://favicon.io/favicon-converter/');

    console.log('🎉 สร้าง favicon ทั้งหมดเสร็จแล้ว!');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

// รันสคริปต์
generateFavicons();
