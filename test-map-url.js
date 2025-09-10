// ทดสอบ URL ที่สร้างจาก createMapOpenUrl
const path = require('path');

// Mock process.cwd() เพื่อใช้งานใน Node.js
process.cwd = () => path.resolve(__dirname);

try {
  // Import business config
  const { BUSINESS_INFO } = require('./config/business.js');

  console.log('=== ทดสอบพิกัดจาก business.js ===');
  console.log('Latitude:', BUSINESS_INFO.coordinates.latitude);
  console.log('Longitude:', BUSINESS_INFO.coordinates.longitude);
  console.log('');

  // สร้าง URL แบบง่าย
  const lat = BUSINESS_INFO.coordinates.latitude;
  const lng = BUSINESS_INFO.coordinates.longitude;
  const testUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  console.log('=== URL ที่สร้างได้ ===');
  console.log(testUrl);
  console.log('');

  // ตรวจสอบว่าเป็นพิกัดใหม่หรือไม่
  if (lat === 18.80508571828391 && lng === 99.03016129487551) {
    console.log('✅ ใช้พิกัดใหม่แล้ว!');
  } else {
    console.log('❌ ยังใช้พิกัดเก่าอยู่');
    console.log('พิกัดที่ควรจะเป็น: 18.80508571828391, 99.03016129487551');
  }
} catch (error) {
  console.error('เกิดข้อผิดพลาด:', error.message);
}
