const fs = require('fs');
const path = require('path');

// สร้าง data URL สำหรับ favicon สีน้ำเงินธรรมดา
const createDataURL = () => {
  // SVG favicon ง่ายๆ สีน้ำเงิน
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#1a237e"/>
    <text x="16" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">ครู</text>
  </svg>`;

  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
};

// อัปเดต manifest.json เพื่อใช้ SVG favicon
const updateManifest = () => {
  const manifestPath = path.join(__dirname, '../public/manifest.json');

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // อัปเดต icons ใหม่
    manifest.icons = [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ];

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ อัปเดต manifest.json แล้ว');
  }
};

// สร้าง Simple SVG favicon
const simpleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <circle cx="128" cy="128" r="120" fill="#1a237e" stroke="none"/>
  <g fill="white">
    <!-- รถยนต์ -->
    <rect x="70" y="110" width="116" height="30" rx="6"/>
    <rect x="60" y="118" width="136" height="14" rx="4"/>
    <!-- หน้าต่าง -->
    <rect x="80" y="104" width="26" height="12" rx="2" fill="#e3f2fd"/>
    <rect x="114" y="104" width="28" height="12" rx="2" fill="#e3f2fd"/>
    <rect x="150" y="104" width="26" height="12" rx="2" fill="#e3f2fd"/>
    <!-- ล้อ -->
    <circle cx="95" cy="150" r="10"/>
    <circle cx="95" cy="150" r="5" fill="#1a237e"/>
    <circle cx="161" cy="150" r="10"/>
    <circle cx="161" cy="150" r="5" fill="#1a237e"/>
    <!-- ไฟ -->
    <circle cx="56" cy="125" r="3" fill="#ffd700"/>
    <circle cx="200" cy="125" r="3" fill="#ff9800"/>
  </g>
  <text x="128" y="190" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">ครู</text>
</svg>`;

// บันทึกไฟล์
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), simpleSVG);

// สร้าง HTML สำหรับ preview
const previewHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Favicon Preview</title>
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>
<body style="font-family: Arial; padding: 20px;">
    <h1>Favicon Preview - ครูหนึ่งรถสวย</h1>
    <p>ดู favicon ที่แท็บเบราว์เซอร์</p>
    <img src="favicon.svg" width="64" height="64" style="border: 1px solid #ccc;">
    <p>SVG favicon สะอาด ไม่มีขอบสีแดง</p>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon-preview.html'), previewHTML);

updateManifest();

console.log('✅ สร้าง favicon.svg ใหม่สำเร็จ (ไม่มีขอบสีแดง)');
console.log('🔍 ดู preview ที่: http://localhost:3000/favicon-preview.html');
console.log('📝 ไฟล์ที่สร้าง:');
console.log('   - public/favicon.svg (ไฟล์หลัก)');
console.log('   - public/favicon-preview.html (สำหรับ preview)');
