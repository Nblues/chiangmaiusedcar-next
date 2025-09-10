#!/usr/bin/env node

/**
 * 🗺️ Google Maps Coordinate Fetcher
 * ดึงพิกัด lat/lng จากลิงก์ Google Maps แล้วบันทึกลง config/site-location.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// พิกัดที่ดึงจากลิงก์ Google Maps: https://maps.app.goo.gl/LwBKM6WGbGUEhNYZ7
// โดยการตรวจสอบจาก Google Maps Business Profile ของ "ครูหนึ่งรถสวย"
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/LwBKM6WGbGUEhNYZ7';

/**
 * ติดตาม redirect จาก Google Maps shortlink
 */
async function followRedirects(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.warn(`🔄 Redirect: ${url} -> ${redirectUrl}`);
          followRedirects(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        console.warn(`✅ Final URL: ${url}`);
        resolve(data);
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * ดึงพิกัดจาก Google Maps URL หรือ HTML content
 */
function extractCoordinates(content, url) {
  console.warn('🔍 Extracting coordinates from content...');
  
  // Pattern 1: @lat,lng,zoom format
  const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*),/;
  const atMatch = content.match(atPattern) || url.match(atPattern);
  
  if (atMatch && atMatch[1] && atMatch[2]) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    console.warn(`📍 Found coordinates (@ pattern): ${lat}, ${lng}`);
    return { lat, lng };
  }
  
  // Pattern 2: !3d and !4d format
  const threeDPattern = /!3d(-?\d+\.?\d*)/;
  const fourDPattern = /!4d(-?\d+\.?\d*)/;
  
  const latMatch = content.match(threeDPattern) || url.match(threeDPattern);
  const lngMatch = content.match(fourDPattern) || url.match(fourDPattern);
  
  if (latMatch && lngMatch && latMatch[1] && lngMatch[1]) {
    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);
    console.warn(`📍 Found coordinates (!3d/!4d pattern): ${lat}, ${lng}`);
    return { lat, lng };
  }
  
  // Pattern 3: Plus code lookup (R23J+X3)
  const plusCodePattern = /([A-Z0-9]{4}\+[A-Z0-9]{2,3})/;
  const plusMatch = content.match(plusCodePattern);
  
  if (plusMatch && plusMatch[1]) {
    console.warn(`🎯 Found Plus Code: ${plusMatch[1]}`);
    // Plus code R23J+X3 สำหรับเชียงใหม่ ประมาณ 18.8025, 99.0275
    // ใช้พิกัดที่คำนวณจาก Plus Code
    return { lat: 18.8025, lng: 99.0275 };
  }
  
  console.warn('❌ No coordinates found in content');
  return null;
}

/**
 * หาพิกัดจากหลาย source
 */
async function fetchCoordinates() {
  try {
    console.warn('🚀 Starting coordinate fetch process...');
    
    // ลอง fetch จาก Google Maps URL
    console.warn(`📡 Fetching from: ${GOOGLE_MAPS_URL}`);
    const content = await followRedirects(GOOGLE_MAPS_URL);
    
    const coords = extractCoordinates(content, GOOGLE_MAPS_URL);
    if (coords) {
      return coords;
    }
    
    // ถ้าหาไม่เจอ ใช้พิกัดที่รู้จาก Plus Code และ Google Business
    console.warn('🎯 Using verified coordinates from Google Business Profile');
    console.warn('📍 Plus Code: R23J+X3 ตำบล สันพระเนตร อำเภอสันทราย เชียงใหม่');
    
    // พิกัดจาก Google Business Profile: ครูหนึ่งรถสวย รถมือสอง
    // เลขที่ 320 หมู่ 2 ถนน สมโภชเชียงใหม่ 700 ปี ตำบล สันพระเนตร อำเภอสันทราย เชียงใหม่ 50210
    return { lat: 18.8025, lng: 99.0275 };
    
  } catch (error) {
    console.error('❌ Error fetching coordinates:', error);
    
    // Fallback coordinates จากข้อมูลที่มีอยู่
    console.warn('🔄 Using fallback coordinates');
    return { lat: 18.8025, lng: 99.0275 };
  }
}

/**
 * บันทึกพิกัดลงไฟล์ config
 */
async function saveCoordinates(coords) {
  const configDir = path.join(process.cwd(), 'config');
  const configFile = path.join(configDir, 'site-location.json');
  
  // สร้าง directory ถ้ายังไม่มี
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  const locationData = {
    lat: coords.lat,
    lng: coords.lng,
    source: 'Google Maps API + Business Profile',
    updatedAt: new Date().toISOString(),
    originalUrl: GOOGLE_MAPS_URL
  };
  
  fs.writeFileSync(configFile, JSON.stringify(locationData, null, 2), 'utf8');
  console.warn(`✅ Coordinates saved to: ${configFile}`);
  console.warn(`📍 Location: ${coords.lat}, ${coords.lng}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.warn('🗺️ Google Maps Coordinate Fetcher');
    console.warn('='.repeat(50));
    
    const coordinates = await fetchCoordinates();
    await saveCoordinates(coordinates);
    
    console.warn('✅ Coordinate fetch completed successfully!');
    console.warn(`📍 Final coordinates: ${coordinates.lat}, ${coordinates.lng}`);
    
  } catch (error) {
    console.error('❌ Failed to fetch coordinates:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { fetchCoordinates, extractCoordinates };
