const fs = require('fs');
const path = require('path');

// สร้าง favicon SVG จาก logo_main.png
const createFaviconFromLogo = () => {
  const logoPath = path.join(__dirname, '../public/logo/logo_main.png');

  // ตรวจสอบว่าไฟล์ logo_main.png มีอยู่หรือไม่
  if (!fs.existsSync(logoPath)) {
    console.error('❌ ไม่พบไฟล์ logo_main.png ใน /public/logo/');
    return;
  }

  // สร้าง SVG wrapper สำหรับ logo_main.png
  const faviconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style>
      .logo-bg {
        fill: #ffffff;
      }
    </style>
  </defs>
  
  <!-- พื้นหลังสีขาว -->
  <rect class="logo-bg" width="32" height="32" rx="2"/>
  
  <!-- รูป logo_main.png ขยายเต็มพื้นที่ -->
  <image x="0" y="0" width="32" height="32" xlink:href="/logo/logo_main.png" preserveAspectRatio="xMidYMid slice"/>
</svg>`;

  // เขียนไฟล์ favicon.svg
  const faviconPath = path.join(__dirname, '../public/favicon.svg');
  fs.writeFileSync(faviconPath, faviconSVG, 'utf8');

  // อัปเดต manifest.json
  const manifestPath = path.join(__dirname, '../public/site.webmanifest');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // อัปเดต icons ใน manifest
    manifest.icons = [
      {
        src: '/logo/logo_main.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo/logo_main.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ];

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ อัปเดต site.webmanifest แล้ว');
  }

  console.log('✅ สร้าง favicon.svg จาก logo_main.png แล้ว');
  console.log('✅ favicon จะใช้ logo_main.png โดยตรงแล้ว');

  // สร้างหน้าตัวอย่าง favicon ใหม่
  const previewHTML = `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ตัวอย่าง Favicon - ครูหนึ่งรถสวย</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" href="/logo/logo_main.png">
    <style>
        body {
            font-family: 'Prompt', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .preview-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .favicon-preview {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .favicon-sizes {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .favicon-item {
            text-align: center;
        }
        .favicon-item img {
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .favicon-item span {
            display: block;
            margin-top: 5px;
            font-size: 12px;
            color: #666;
        }
        h1 {
            color: #1a237e;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #1a237e;
            border-bottom: 2px solid #ff9800;
            padding-bottom: 10px;
        }
        .note {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #1a237e;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🚗 Favicon ใหม่ - ใช้ logo_main.png</h1>
    
    <div class="preview-container">
        <h2>ตัวอย่างการแสดงผล Favicon</h2>
        
        <div class="favicon-preview">
            <strong>Favicon ในแท็บเบราว์เซอร์:</strong>
            <div class="favicon-sizes">
                <div class="favicon-item">
                    <img src="/logo/logo_main.png" width="16" height="16" alt="16x16">
                    <span>16×16</span>
                </div>
                <div class="favicon-item">
                    <img src="/logo/logo_main.png" width="32" height="32" alt="32x32">
                    <span>32×32</span>
                </div>
                <div class="favicon-item">
                    <img src="/favicon.svg" width="48" height="48" alt="SVG">
                    <span>SVG</span>
                </div>
            </div>
        </div>
        
        <div class="note">
            <strong>📋 การอัปเดต:</strong><br>
            • ใช้ logo_main.png เป็น favicon โดยตรง<br>
            • สร้าง favicon.svg wrapper สำหรับการแสดงผลที่ดีขึ้น<br>
            • อัปเดต manifest.json ให้ใช้ logo_main.png<br>
            • รองรับทุกขนาดและอุปกรณ์
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="/" style="background: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                กลับหน้าแรก
            </a>
        </div>
    </div>
</body>
</html>`;

  const previewPath = path.join(__dirname, '../public/favicon-logo-preview.html');
  fs.writeFileSync(previewPath, previewHTML, 'utf8');
  console.log('✅ สร้างหน้าตัวอย่าง favicon-logo-preview.html แล้ว');
};

// รันสคริปต์
createFaviconFromLogo();
