// Simple PNG favicon generator using Canvas
const fs = require('fs');
const path = require('path');

// สร้าง PNG favicon แบบง่าย (ใช้ ASCII art pattern)
function generateSimplePNG(size) {
  // สร้าง PNG header
  const width = size;
  const height = size;

  // สร้างข้อมูลพิกเซลสำหรับไอคอนรถยนต์สีน้ำเงิน
  const pixels = [];
  const blue = [26, 35, 126, 255]; // #1a237e
  const white = [255, 255, 255, 255];
  const orange = [255, 152, 0, 255]; // #ff9800
  const transparent = [0, 0, 0, 0];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      // สร้างวงกลมสีน้ำเงิน
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distFromCenter <= radius) {
        pixels.push(...blue);
      } else {
        pixels.push(...transparent);
      }
    }
  }

  return Buffer.from(pixels);
}

// สร้าง SVG favicon แทน (เรียบง่ายกว่า)
const createSimpleSVGFavicon = () => {
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="15" fill="#1a237e"/>
  <rect x="8" y="12" width="16" height="4" rx="1" fill="#ffffff"/>
  <rect x="6" y="14" width="20" height="2" rx="1" fill="#ffffff"/>
  <circle cx="11" cy="19" r="2" fill="#ffffff"/>
  <circle cx="21" cy="19" r="2" fill="#ffffff"/>
  <rect x="10" y="10" width="4" height="2" rx="0.5" fill="#e3f2fd"/>
  <rect x="14" y="10" width="4" height="2" rx="0.5" fill="#e3f2fd"/>
  <rect x="18" y="10" width="4" height="2" rx="0.5" fill="#e3f2fd"/>
  <circle cx="5" cy="15" r="1" fill="#ffd700"/>
  <circle cx="27" cy="15" r="1" fill="#ff9800"/>
</svg>`;
};

// บันทึก SVG favicon
const svgContent = createSimpleSVGFavicon();
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);

console.log('✅ สร้าง favicon.svg สำเร็จ');
console.log('💡 เปิดไฟล์ public/favicon.svg และใช้เครื่องมือออนไลน์แปลงเป็น PNG:');
console.log('   - https://convertio.co/svg-png/');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - ตั้งขนาด 256x256 สำหรับ favicon.png หลัก');
