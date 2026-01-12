/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteLocation, createMapEmbedUrl, createMapOpenUrl } from '../utils/siteLocation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [mapUrls, setMapUrls] = useState({
    open: '',
    embed: '',
  });

  useEffect(() => {
    // Load location data on client side
    const loadLocationData = async () => {
      try {
        await getSiteLocation(); // Ensure location config is loaded

        // Generate map URLs
        const openUrl = createMapOpenUrl();
        const embedUrl = createMapEmbedUrl();

        setMapUrls({
          open: openUrl,
          embed: embedUrl,
        });
      } catch {
        // Fallback to hardcoded values if utils fail
        setMapUrls({
          open: 'https://www.google.com/maps/place/ครูหนึ่งรถสวย+รถมือสอง/@18.80508571828391,99.03016129487551,17z',
          embed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.0123456789!2d99.03016129487551!3d18.80508571828391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da39b7b3b3b3b3%3A0x1234567890abcdef!2z4LiE4Lij4Li54Lir4LiZ4Li24LmI4LiH4Lij4LiW4LmA4Li04LiB!5e0!3m2!1sth!2sth!4v1234567890123!5m2!1sth!2sth',
        });
      }
    };

    loadLocationData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16 font-prompt" role="contentinfo">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-gold shadow-lg overflow-hidden">
                  <picture>
                    <source srcSet="/logo/logo_main_optimized.webp" type="image/webp" />
                    <img
                      src="/logo/logo_main.png"
                      alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
                      width="64"
                      height="64"
                      className="w-full h-full object-cover scale-125"
                      loading="eager"
                    />
                  </picture>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ครูหนึ่งรถสวย
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  รถมือสองเชียงใหม่ คุณภาพระดับพรีเมียม
                </p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ให้บริการด้วยความจริงใจ มีรับประกันหลังการขาย
              พร้อมบริการสินเชื่อและคำปรึกษาเรื่องไฟแนนซ์ครบวงจร
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-1">ที่อยู่ร้าน</p>
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    324 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี
                    <br />
                    ตำบลสันพระเนตร อำเภอสันทราย เชียงใหม่ 50210
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">โทรศัพท์</p>
                  <a
                    href="tel:0940649018"
                    className="text-accent-400 hover:text-accent-300 transition-colors font-medium text-lg"
                  >
                    094-064-9018
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">เวลาทำการ</p>
                  <p className="text-gray-300 text-sm">เปิดทุกวัน 9 โมงถึง 20:00 น</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative">
              เมนูหลัก
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-400"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link
                  href="/all-cars"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm6-11a2 2 0 012-2h3a2 2 0 012 2v8a2 2 0 01-2 2h-3a2 2 0 01-2-2V4zm2 0v4h3V4h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  รถทั้งหมด
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-car"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  ขายรถ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link
                  href="/credit-check"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                  เช็คเครดิต
                </Link>
              </li>
              <li>
                <Link
                  href="/promotion"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                  โปรโมชัน
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ติดต่อ
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-calculator"
                  className="text-gray-300 hover:text-accent-400 transition-colors flex items-center group"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-accent-500 group-hover:text-accent-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  คำนวนค่างวด
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative">
              ติดตามเรา
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-400"></div>
            </h4>

            <div className="space-y-4 mb-6">
              <a
                href="https://www.facebook.com/KN2car"
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    Facebook
                  </p>
                  <p className="text-gray-400 text-xs">ครูหนึ่งรถสวย</p>
                </div>
              </a>

              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-green-400 transition-colors">
                    LINE
                  </p>
                  <p className="text-gray-400 text-xs">ครูหนึ่งรถสวย</p>
                </div>
              </a>

              <a
                href="https://youtube.com/@chiangraiusedcar"
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-red-400 transition-colors">
                    YouTube
                  </p>
                  <p className="text-gray-400 text-xs">ครูหนึ่งรถสวย</p>
                </div>
              </a>

              <a
                href="https://www.tiktok.com/@krunueng_usedcar"
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-pink-400 transition-colors">
                    TikTok
                  </p>
                  <p className="text-gray-400 text-xs">ครูหนึ่งรถสวย</p>
                </div>
              </a>
            </div>

            {/* Quick Contact Button */}
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              className="block w-full bg-primary hover:bg-primary-600 text-white text-center py-3 px-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              rel="noreferrer"
            >
              สอบถามเลย
            </a>
          </div>

          {/* Google Maps & Business */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative">
              แผนที่และบริการ
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-400"></div>
            </h4>

            <div className="space-y-4">
              <a
                href={
                  mapUrls.open ||
                  'https://www.google.com/maps/place/ครูหนึ่งรถสวย+รถมือสอง/@18.80508571828391,99.03016129487551,17z'
                }
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-red-400 transition-colors">
                    Google Maps
                  </p>
                  <p className="text-gray-400 text-xs">ดูตำแหน่งร้าน</p>
                </div>
              </a>

              <a
                href="https://g.co/kgs/Fe9dhXt"
                target="_blank"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                rel="noreferrer"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    Google Business
                  </p>
                  <p className="text-gray-400 text-xs">รีวิวลูกค้า</p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-green-400 transition-colors">
                    แผนที่ร้าน
                  </p>
                  <p className="text-gray-400 text-xs">ดูทางเดินทาง</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} ครูหนึ่งรถสวย. สงวนลิขสิทธิ์ทุกประการ
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-accent-400 text-sm transition-colors"
              >
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-400 hover:text-accent-400 text-sm transition-colors"
              >
                ข้อกำหนดการใช้งาน
              </Link>
              <span className="text-gray-600">|</span>
              <p className="text-gray-300 text-xs">Designed with ❤️ in Chiang Mai</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
