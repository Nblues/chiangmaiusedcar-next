#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Google Maps Coordinate Resolver
 *
 * ดึงพิกัดจริงจาก Google share link และอัปเดตการตั้งค่าโครงการ
 *
 * วิธีใช้:
 * npm run resolve:map
 *
 * หรือ:
 * node dev/scripts/resolve-map-coords.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ค่าตั้งต้น
const GOOGLE_SHARE_URL = 'https://share.google/UuNOeZP6G9wOiPeui';
const CONFIG_DIR = path.resolve(process.cwd(), 'config');
const LOCATION_CONFIG_PATH = path.join(CONFIG_DIR, 'site-location.json');

// ค่าเริ่มต้นถ้าไม่มีไฟล์
const DEFAULT_LOCATION = {
  lat: 0,
  lng: 0,
  source: 'unset',
};

/**
 * ตรวจสอบว่ามีไดเรกทอรี config หรือไม่
 */
function ensureConfigDirectory() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    console.log(`✅ สร้างไดเรกทอรี: ${CONFIG_DIR}`);
  }
}

/**
 * อ่านการตั้งค่าตำแหน่งปัจจุบัน
 */
function readCurrentLocation() {
  if (fs.existsSync(LOCATION_CONFIG_PATH)) {
    try {
      const content = fs.readFileSync(LOCATION_CONFIG_PATH, 'utf8');
      const location = JSON.parse(content);
      console.log(
        `📍 อ่านตำแหน่งปัจจุบัน: lat=${location.lat}, lng=${location.lng}, source=${location.source}`
      );
      return location;
    } catch (error) {
      console.warn(`⚠️  ไม่สามารถอ่านไฟล์ ${LOCATION_CONFIG_PATH}: ${error}`);
      return DEFAULT_LOCATION;
    }
  }

  console.log('📂 ไม่พบไฟล์การตั้งค่าตำแหน่ง - สร้างค่าเริ่มต้น');
  return DEFAULT_LOCATION;
}

/**
 * บันทึกการตั้งค่าตำแหน่งใหม่
 */
function saveLocation(location) {
  try {
    const content = JSON.stringify(location, null, 2);
    fs.writeFileSync(LOCATION_CONFIG_PATH, content, 'utf8');
    console.log(`💾 บันทึกตำแหน่งใหม่: ${LOCATION_CONFIG_PATH}`);
    console.log(`   lat: ${location.lat}`);
    console.log(`   lng: ${location.lng}`);
    console.log(`   source: ${location.source}`);
  } catch (error) {
    console.error(`❌ ไม่สามารถบันทึกไฟล์: ${error}`);
    throw error;
  }
}

/**
 * ติดตาม URL redirect โดยใช้ curl
 */
function followRedirects(url) {
  try {
    console.log(`🔍 ติดตาม redirect สำหรับ: ${url}`);

    // ใช้ curl เพื่อติดตาม redirects และดึง final URL
    const command = `curl -s -L -I -o nul -w "%{url_effective}" "${url}"`;

    const finalUrl = execSync(command, {
      encoding: 'utf8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    console.log(`🎯 URL ปลายทาง: ${finalUrl}`);
    return finalUrl;
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการติดตาม URL: ${error}`);
    throw error;
  }
}

/**
 * แยกพิกัดจาก Google Maps URL
 */
function extractCoordinates(url) {
  console.log(`🧭 แยกพิกัดจาก URL: ${url}`);

  // รูปแบบ 1: @LAT,LNG,ZOOM (เช่น @18.790123,98.985432,17z)
  const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*),\d+/;
  const match1 = url.match(pattern1);

  if (match1 && match1[1] && match1[2]) {
    const lat = parseFloat(match1[1]);
    const lng = parseFloat(match1[2]);
    console.log(`✅ พบพิกัดรูปแบบ @lat,lng: ${lat}, ${lng}`);
    return { lat, lng };
  }

  // รูปแบบ 2: !3dLAT!4dLNG (เช่น !3d18.790123!4d98.985432)
  const pattern2 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
  const match2 = url.match(pattern2);

  if (match2 && match2[1] && match2[2]) {
    const lat = parseFloat(match2[1]);
    const lng = parseFloat(match2[2]);
    console.log(`✅ พบพิกัดรูปแบบ !3d!4d: ${lat}, ${lng}`);
    return { lat, lng };
  }

  // รูปแบบ 3: /place/.../@LAT,LNG
  const pattern3 = /\/place\/[^\/]*\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const match3 = url.match(pattern3);

  if (match3 && match3[1] && match3[2]) {
    const lat = parseFloat(match3[1]);
    const lng = parseFloat(match3[2]);
    console.log(`✅ พบพิกัดรูปแบบ place/@: ${lat}, ${lng}`);
    return { lat, lng };
  }

  console.log(`❌ ไม่พบพิกัดใน URL`);
  return null;
}

/**
 * ตรวจสอบความถูกต้องของพิกัด
 */
function validateCoordinates(lat, lng) {
  const isValidLat = lat >= -90 && lat <= 90;
  const isValidLng = lng >= -180 && lng <= 180;

  if (!isValidLat) {
    console.error(`❌ Latitude ไม่ถูกต้อง: ${lat} (ต้องอยู่ระหว่าง -90 ถึง 90)`);
  }

  if (!isValidLng) {
    console.error(`❌ Longitude ไม่ถูกต้อง: ${lng} (ต้องอยู่ระหว่าง -180 ถึง 180)`);
  }

  return isValidLat && isValidLng;
}

/**
 * ฟังก์ชันหลัก
 */
async function main() {
  console.log('🚀 เริ่มต้นการแก้ไขพิกัดแผนที่...\n');

  try {
    // 1. ตรวจสอบไดเรกทอรี config
    ensureConfigDirectory();

    // 2. อ่านการตั้งค่าปัจจุบัน
    const currentLocation = readCurrentLocation();

    // 3. ติดตาม Google share URL
    let finalUrl;
    try {
      finalUrl = followRedirects(GOOGLE_SHARE_URL);
    } catch (error) {
      console.error(`❌ ไม่สามารถติดตาม URL ได้: ${error}`);
      console.log(`⚠️  คงการตั้งค่าเดิมไว้`);

      // สร้างไฟล์เริ่มต้นถ้ายังไม่มี
      if (!fs.existsSync(LOCATION_CONFIG_PATH)) {
        saveLocation(currentLocation);
      }
      return;
    }

    // 4. แยกพิกัด
    const coordinates = extractCoordinates(finalUrl);

    if (!coordinates) {
      console.log(`⚠️  ไม่พบพิกัดใน URL - คงการตั้งค่าเดิมไว้`);

      // สร้างไฟล์เริ่มต้นถ้ายังไม่มี
      if (!fs.existsSync(LOCATION_CONFIG_PATH)) {
        saveLocation(currentLocation);
      }
      return;
    }

    // 5. ตรวจสอบความถูกต้อง
    if (!validateCoordinates(coordinates.lat, coordinates.lng)) {
      console.error(`❌ พิกัดไม่ถูกต้อง - คงการตั้งค่าเดิมไว้`);
      return;
    }

    // 6. สร้างการตั้งค่าใหม่
    const newLocation = {
      lat: coordinates.lat,
      lng: coordinates.lng,
      source: 'share.google',
      updated: new Date().toISOString(),
      original_url: GOOGLE_SHARE_URL,
    };

    // 7. ตรวจสอบว่าพิกัดเปลี่ยนแปลงหรือไม่
    const hasChanged =
      Math.abs(currentLocation.lat - newLocation.lat) > 0.0001 ||
      Math.abs(currentLocation.lng - newLocation.lng) > 0.0001;

    if (hasChanged) {
      console.log(`🔄 พิกัดเปลี่ยนแปลง:`);
      console.log(`   เก่า: lat=${currentLocation.lat}, lng=${currentLocation.lng}`);
      console.log(`   ใหม่: lat=${newLocation.lat}, lng=${newLocation.lng}`);

      // 8. บันทึกการตั้งค่าใหม่
      saveLocation(newLocation);

      console.log(`\n✅ อัปเดตพิกัดสำเร็จ!`);
      console.log(`📍 พิกัดใหม่: ${newLocation.lat}, ${newLocation.lng}`);
    } else {
      console.log(`✅ พิกัดไม่เปลี่ยนแปลง - ข้อมูลล่าสุดอยู่แล้ว`);

      // อัปเดตข้อมูล source และ updated เท่านั้น
      const updatedLocation = {
        ...currentLocation,
        source: 'share.google',
        updated: new Date().toISOString(),
        original_url: GOOGLE_SHARE_URL,
      };
      saveLocation(updatedLocation);
    }
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาด: ${error}`);
    process.exit(1);
  }
}

// รันสคริปต์
if (require.main === module) {
  main().catch(error => {
    console.error('❌ เกิดข้อผิดพลาดร้ายแรง:', error);
    process.exit(1);
  });
}
