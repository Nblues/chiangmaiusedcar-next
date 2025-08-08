console.log('🔍 กำลังตรวจสอบสถานะเซิร์ฟเวอร์...');

const http = require('http');

function testServer() {
  const req = http.get('http://localhost:3000', res => {
    console.log(`✅ เซิร์ฟเวอร์ทำงาน - สถานะ: ${res.statusCode}`);

    if (res.statusCode === 200) {
      console.log('🎉 เซิร์ฟเวอร์พร้อมใช้งาน!');
      console.log('🌐 เปิดเบราว์เซอร์ไปที่: http://localhost:3000');
      console.log('📄 ทดสอบหน้าข่าวสาร: http://localhost:3000/blog');
    } else {
      console.log('⚠️  เซิร์ฟเวอร์มีปัญหา');
    }
  });

  req.on('error', err => {
    console.log('❌ เซิร์ฟเวอร์ไม่ทำงาน:', err.message);
    console.log('💡 กรุณาเรียก: pnpm dev');
  });

  req.setTimeout(5000, () => {
    req.destroy();
    console.log('⏰ Timeout - เซิร์ฟเวอร์ตอบสนองช้า');
  });
}

testServer();
