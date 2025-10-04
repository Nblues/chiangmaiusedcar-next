/**
 * Facebook Pixel Component - Lazy Loaded
 * โหลดหลังจากหน้าเว็บโหลดเสร็จแล้ว เพื่อไม่ block initial page load
 * ลด TBT (Total Blocking Time) และเพิ่ม Performance Score
 */

'use client';
import { useEffect } from 'react';

export default function FacebookPixel() {
  useEffect(() => {
    // Lazy load Facebook Pixel หลังจาก page โหลดเสร็จ 3 วินาที
    const timeoutId = setTimeout(() => {
      // ตรวจสอบว่ายังไม่ได้โหลด
      if (window.fbq) return;

      // สร้าง fbq function stub
      window.fbq = function () {
        if (window.fbq.callMethod) {
          window.fbq.callMethod.apply(window.fbq, arguments);
        } else {
          window.fbq.queue.push(arguments);
        }
      };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq.queue = [];

      // โหลด Facebook Pixel script
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Initialize Facebook Pixel
        if (window.fbq) {
          window.fbq('init', '939085106560508');
          window.fbq('track', 'PageView');
        }
      };

      script.onerror = () => {
        // Silent fail - Facebook Pixel is non-critical
      };

      document.body.appendChild(script);
    }, 3000); // โหลดหลัง 3 วินาที

    return () => clearTimeout(timeoutId);
  }, []);

  // Noscript fallback
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=939085106560508&ev=PageView&noscript=1"
        alt=""
      />
    </noscript>
  );
}
