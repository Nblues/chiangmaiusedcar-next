/**
 * Facebook Pixel Component - Interaction-based Lazy Loading
 * โหลดเมื่อผู้ใช้มีปฏิสัมพันธ์กับหน้าเว็บ (scroll, click, touch) หรือรอ 5 วินาที
 * ลด JavaScript ที่ไม่จำเป็น, ลด TBT และเพิ่ม Performance Score
 * ประหยัดพื้นที่ ~48 KiB ของ unused JavaScript
 */

'use client';
import { useEffect } from 'react';

export default function FacebookPixel() {
  useEffect(() => {
    let loaded = false;
    let timeoutId = null;

    const loadFacebookPixel = () => {
      // ป้องกันการโหลดซ้ำ
      if (loaded || window.fbq) return;
      loaded = true;

      // ยกเลิก timeout ถ้ามี
      if (timeoutId) clearTimeout(timeoutId);

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
    };

    // Event listeners สำหรับการโต้ตอบของผู้ใช้
    const interactionEvents = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'];
    
    const handleInteraction = () => {
      loadFacebookPixel();
      // ลบ event listeners หลังจากโหลดแล้ว
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };

    // ติดตั้ง event listeners
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true, once: true });
    });

    // Fallback: โหลดหลัง 5 วินาทีถ้าไม่มีการโต้ตอบ
    timeoutId = setTimeout(() => {
      loadFacebookPixel();
      // ลบ event listeners
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    }, 5000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
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
