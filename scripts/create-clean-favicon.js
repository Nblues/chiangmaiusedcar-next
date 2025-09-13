const fs = require('fs');
const path = require('path');

// สร้าง SVG favicon ใหม่แบบเรียบง่าย ไม่มีขอบสีแดง
const createCleanFavicon = () => {
  const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- พื้นหลังโปร่งใส -->
  <rect width="256" height="256" fill="none"/>
  
  <!-- วงกลมพื้นหลังสีน้ำเงิน -->
  <circle cx="128" cy="128" r="118" fill="#1a237e" stroke="none"/>
  
  <!-- ไอคอนรถยนต์ -->
  <g fill="#ffffff">
    <!-- ตัวรถหลัก -->
    <rect x="60" y="100" width="136" height="36" rx="8" ry="8"/>
    <rect x="50" y="110" width="156" height="20" rx="6" ry="6"/>
    
    <!-- หน้าต่าง -->
    <rect x="70" y="92" width="32" height="16" rx="2" ry="2" fill="#e3f2fd"/>
    <rect x="110" y="92" width="36" height="16" rx="2" ry="2" fill="#e3f2fd"/>
    <rect x="154" y="92" width="32" height="16" rx="2" ry="2" fill="#e3f2fd"/>
    
    <!-- ล้อ -->
    <circle cx="85" cy="145" r="12" fill="#ffffff"/>
    <circle cx="85" cy="145" r="6" fill="#1a237e"/>
    <circle cx="171" cy="145" r="12" fill="#ffffff"/>
    <circle cx="171" cy="145" r="6" fill="#1a237e"/>
    
    <!-- ไฟหน้า -->
    <circle cx="48" cy="120" r="4" fill="#ffd700"/>
    <circle cx="208" cy="120" r="4" fill="#ff9800"/>
  </g>
  
  <!-- ข้อความ "ครู" -->
  <text x="128" y="185" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">ครู</text>
</svg>`;

  return svg;
};

// บันทึก SVG
const svgContent = createCleanFavicon();
const svgPath = path.join(__dirname, '../public/favicon.svg');
fs.writeFileSync(svgPath, svgContent);

console.log('✅ สร้าง favicon.svg ใหม่แล้ว (ไม่มีขอบสีแดง)');

// สร้างคำแนะนำการแปลงเป็น PNG
console.log('');
console.log('📝 ขั้นตอนต่อไป:');
console.log('1. เปิด https://cloudconvert.com/svg-to-png');
console.log('2. อัปโหลดไฟล์ public/favicon.svg');
console.log('3. ตั้งขนาด 256x256 pixels');
console.log('4. ดาวน์โหลดและแทนที่ public/favicon.png');
console.log('5. ทำซ้ำสำหรับขนาดอื่นๆ (16, 32, 48, 96, 144, 192, 384)');
console.log('6. แปลงเป็น favicon.ico ที่ https://favicon.io/favicon-converter/');
