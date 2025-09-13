const fs = require('fs');
const path = require('path');

// สร้าง cropped version ของ logo_main.png
const createCroppedFavicon = () => {
  // สร้าง SVG ที่ crop เนื้อหาส่วนกลางจาก logo_main.png
  const croppedSVG = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- พื้นหลังโปร่งใส -->
  <rect width="256" height="256" fill="none"/>
  
  <!-- ใช้ image จาก logo_main.png แล้ว crop ส่วนกลาง -->
  <defs>
    <clipPath id="cropCircle">
      <circle cx="128" cy="128" r="120"/>
    </clipPath>
  </defs>
  
  <!-- โหลดรูป logo_main.png และ crop เอาส่วนกลาง -->
  <image 
    href="/logo/logo_main.png" 
    x="-50" 
    y="-50" 
    width="356" 
    height="356" 
    clip-path="url(#cropCircle)"
    preserveAspectRatio="xMidYMid slice"
  />
</svg>`;

  return croppedSVG;
};

// สร้าง manual crop version (เผื่อ image tag ไม่ work)
const createManualCrop = () => {
  const manualSVG = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- วงกลมพื้นหลังสีน้ำเงิน -->
  <circle cx="128" cy="128" r="120" fill="#1a237e"/>
  
  <!-- โลโก้รถยนต์ขนาดใหญ่ เต็มพื้นที่ -->
  <g fill="#ffffff" transform="scale(1.5) translate(-42, -42)">
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
  
  <!-- ข้อความ "ครู" ขนาดใหญ่ -->
  <text x="128" y="200" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#ffffff">ครู</text>
</svg>`;

  return manualSVG;
};

// บันทึกทั้งสองเวอร์ชัน
const croppedVersion = createCroppedFavicon();
const manualVersion = createManualCrop();

// บันทึกไฟล์
fs.writeFileSync(path.join(__dirname, '../public/favicon-cropped.svg'), croppedVersion);
fs.writeFileSync(path.join(__dirname, '../public/favicon-manual.svg'), manualVersion);

// สร้างหน้าเปรียบเทียบ
const comparisonHTML = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เปรียบเทียบ Favicon</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        h1 { color: #1a237e; text-align: center; }
        .comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .version { border: 2px solid #ddd; border-radius: 10px; padding: 15px; text-align: center; }
        .version img { width: 128px; height: 128px; border: 1px solid #ccc; margin: 10px; background: #f9f9f9; }
        .favicon-sizes { display: flex; justify-content: center; gap: 10px; margin: 10px 0; }
        .favicon-sizes img { width: 32px; height: 32px; border: 1px solid #ccc; }
        .bg-dark { background: #333; }
        .bg-light { background: #fff; }
        .recommended { border-color: #4caf50; background: #f1f8e9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 เปรียบเทียบ Favicon - ครูหนึ่งรถสวย</h1>
        
        <div class="comparison">
            <div class="version">
                <h3>เดิม (logo_main.png)</h3>
                <img src="/logo/logo_main.png" alt="Logo เดิม">
                <p>มีพื้นที่ว่างสีขาว + ขอบ</p>
            </div>
            
            <div class="version">
                <h3>แบบ Crop (SVG)</h3>
                <img src="/favicon-cropped.svg" alt="Favicon cropped">
                <p>Crop เอาส่วนกลางจาก logo_main.png</p>
            </div>
            
            <div class="version recommended">
                <h3>แบบ Manual (แนะนำ)</h3>
                <img src="/favicon-manual.svg" alt="Favicon manual">
                <p>วาดใหม่ ขยายเต็มพื้นที่</p>
                <strong>✅ แนะนำใช้</strong>
            </div>
        </div>
        
        <h3>ทดสอบขนาดเล็ก (32px)</h3>
        <div class="favicon-sizes">
            <div>
                <p>เดิม</p>
                <img src="/logo/logo_main.png" alt="เดิม 32px" class="bg-light">
                <img src="/logo/logo_main.png" alt="เดิม 32px" class="bg-dark">
            </div>
            <div>
                <p>Crop</p>
                <img src="/favicon-cropped.svg" alt="Crop 32px" class="bg-light">
                <img src="/favicon-cropped.svg" alt="Crop 32px" class="bg-dark">
            </div>
            <div>
                <p>Manual</p>
                <img src="/favicon-manual.svg" alt="Manual 32px" class="bg-light">
                <img src="/favicon-manual.svg" alt="Manual 32px" class="bg-dark">
            </div>
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>📝 สรุป:</h3>
            <p><strong>แนะนำใช้ favicon-manual.svg</strong> เพราะ:</p>
            <ul>
                <li>ขยายเต็มพื้นที่ ไม่มีพื้นที่ว่าง</li>
                <li>เห็นชัดแม้ในขนาดเล็ก (16px, 32px)</li>
                <li>ไม่มีขอบหรือพื้นหลังรบกวน</li>
                <li>เหมาะสำหรับ browser tab</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon-comparison.html'), comparisonHTML);

console.log('✅ สร้างไฟล์เปรียบเทียบแล้ว:');
console.log('   - favicon-cropped.svg (crop จาก logo_main.png)');
console.log('   - favicon-manual.svg (วาดใหม่ขยายเต็มพื้นที่)');
console.log('   - favicon-comparison.html (หน้าเปรียบเทียบ)');
console.log('');
console.log('🔍 ดู comparison ที่: http://localhost:3000/favicon-comparison.html');
console.log('💡 แนะนำใช้ favicon-manual.svg เพราะเหมาะสำหรับ favicon มากที่สุด');
