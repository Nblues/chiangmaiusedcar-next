/**
 * แปลง logo_main.png เป็น WebP เพื่อลดขนาดและเพิ่มความเร็ว LCP
 * ใช้ sharp library สำหรับแปลงรูปภาพ
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertLogoToWebP() {
  const inputPath = path.join(__dirname, '../public/logo/logo_main.png');
  const outputPath = path.join(__dirname, '../public/logo/logo_main.webp');

  try {
    console.log('🔄 กำลังแปลง logo_main.png เป็น WebP...\n');

    // ตรวจสอบว่าไฟล์ต้นฉบับมีอยู่
    if (!fs.existsSync(inputPath)) {
      console.error('❌ ไม่พบไฟล์ logo_main.png');
      process.exit(1);
    }

    // อ่านขนาดไฟล์ต้นฉบับ
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(2);

    // แปลงเป็น WebP ด้วย quality 85 (balance ระหว่างคุณภาพและขนาด)
    await sharp(inputPath).webp({ quality: 85, effort: 6 }).toFile(outputPath);

    // อ่านขนาดไฟล์ใหม่
    const webpStats = fs.statSync(outputPath);
    const webpSizeKB = (webpStats.size / 1024).toFixed(2);
    const savedKB = (originalSizeKB - webpSizeKB).toFixed(2);
    const savedPercent = ((savedKB / originalSizeKB) * 100).toFixed(1);

    console.log('✅ แปลงสำเร็จ!\n');
    console.log('📊 สถิติ:');
    console.log(`   PNG:  ${originalSizeKB} KB`);
    console.log(`   WebP: ${webpSizeKB} KB`);
    console.log(`   ประหยัด: ${savedKB} KB (${savedPercent}%)\n`);
    console.log('📁 ไฟล์ที่สร้าง:');
    console.log(`   ${outputPath}\n`);
    console.log('🎯 ขั้นตอนถัดไป:');
    console.log('   1. ตรวจสอบไฟล์ logo_main.webp');
    console.log('   2. แก้โค้ดให้ใช้ <picture> tag พร้อม fallback');
    console.log('   3. ไฟล์ .png เดิมยังคงอยู่เพื่อ backward compatibility\n');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

// รันทันที
convertLogoToWebP();
