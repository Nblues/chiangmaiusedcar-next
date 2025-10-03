/**
 * Bootstrap Rich Text Editor Template
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * ระบบแก้ไขข้อความแบบ Bootstrap สำเร็จรูป
 */

import { useState, useRef } from 'react';
import ImageGallery from './ImageGallery';
import { processImagesInContent } from '../lib/imageUtils';

const BootstrapRichTextEditor = ({
  value,
  onChange,
  placeholder = 'เขียนเนื้อหาบทความ...',
  articleId,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const textareaRef = useRef(null);

  // ฟังก์ชันสำหรับแทรกรูปภาพจาก Gallery
  const handleImageSelect = imgTag => {
    const textarea = textareaRef.current;

    // ตรวจสอบว่า textarea พร้อมใช้งาน
    if (!textarea) {
      console.warn('Textarea not ready, inserting image at end of content');
      onChange(value + '\n\n' + imgTag);
      setShowImageGallery(false);
      return;
    }

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + imgTag + value.substring(start);
    onChange(newText);

    setShowImageGallery(false);
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + imgTag.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  // ฟังก์ชันสำหรับแทรก HTML tags
  const insertTag = (openTag, closeTag = '') => {
    const textarea = textareaRef.current;

    // ตรวจสอบว่า textarea พร้อมใช้งาน
    if (!textarea) {
      console.warn('Textarea not ready, inserting at end of content');
      onChange(value + openTag + closeTag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);

    onChange(newText);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + openTag.length + selectedText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  // Bootstrap Quick Insert Templates
  const insertBootstrapTemplate = template => {
    const textarea = textareaRef.current;

    // ตรวจสอบว่า textarea พร้อมใช้งาน
    if (!textarea) {
      console.warn('Textarea not ready, inserting template at end of content');
      onChange(value + '\n\n' + template);
      return;
    }

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + template + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + template.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  // Bootstrap Templates - Modern 2025 Design
  const bootstrapTemplates = {
    alert: `<div class="alert alert-primary d-flex align-items-center" role="alert">
  <i class="bi bi-info-circle-fill fs-4 me-3"></i>
  <div>
    <strong>ข้อมูลสำคัญ:</strong> ข้อความสำคัญที่ต้องการเน้น แบบ Modern 2025
  </div>
</div>`,

    card: `<div class="card shadow-sm border-0 mb-4 rounded-4">
  <div class="card-body p-4">
    <div class="d-flex align-items-center mb-3">
      <div class="bg-primary bg-gradient rounded-3 p-2 me-3">
        <i class="bi bi-star-fill text-white fs-5"></i>
      </div>
      <h5 class="card-title mb-0 fw-bold">หัวข้อการ์ดสไตล์ 2025</h5>
    </div>
    <p class="card-text text-muted">เนื้อหาในการ์ดที่ออกแบบให้ดูทันสมัยและสวยงาม</p>
    <a href="#" class="btn btn-outline-primary rounded-pill px-4">
      <i class="bi bi-arrow-right me-2"></i>อ่านเพิ่มเติม
    </a>
  </div>
</div>`,

    table: `<div class="table-responsive rounded-3 shadow-sm">
  <table class="table table-hover align-middle mb-0">
    <thead class="bg-gradient bg-primary text-white">
      <tr>
        <th class="border-0 py-3"><i class="bi bi-car-front me-2"></i>รุ่นรถ</th>
        <th class="border-0 py-3"><i class="bi bi-currency-dollar me-2"></i>ราคา</th>
        <th class="border-0 py-3"><i class="bi bi-star-fill me-2"></i>คะแนน</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-bottom">
        <td class="py-3"><strong>Honda City 2025</strong></td>
        <td class="py-3"><span class="badge bg-success fs-6">฿799,000</span></td>
        <td class="py-3">
          <div class="d-flex align-items-center">
            <span class="text-warning me-1">
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
            </span>
            <small class="text-muted">(4.8/5)</small>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,

    columns: `<div class="row g-4">
  <div class="col-lg-6">
    <div class="bg-light rounded-4 p-4 h-100">
      <div class="d-flex align-items-center mb-3">
        <div class="bg-success bg-gradient rounded-circle p-2 me-3">
          <i class="bi bi-check-circle-fill text-white"></i>
        </div>
        <h4 class="mb-0 fw-bold text-success">ข้อดี</h4>
      </div>
      <p class="mb-0 text-muted">เนื้อหาคอลัมน์ซ้าย - จุดเด่นและข้อดีต่างๆ</p>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="bg-light rounded-4 p-4 h-100">
      <div class="d-flex align-items-center mb-3">
        <div class="bg-warning bg-gradient rounded-circle p-2 me-3">
          <i class="bi bi-exclamation-triangle-fill text-white"></i>
        </div>
        <h4 class="mb-0 fw-bold text-warning">ข้อควรระวัง</h4>
      </div>
      <p class="mb-0 text-muted">เนื้อหาคอลัมน์ขวา - ข้อควรพิจารณา</p>
    </div>
  </div>
</div>`,

    button: `<div class="text-center my-4">
  <a href="#" class="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-sm">
    <i class="bi bi-arrow-right-circle-fill me-2"></i>
    ติดต่อเราเลย
  </a>
</div>`,

    badge: `<div class="d-flex flex-wrap gap-2 my-3">
  <span class="badge bg-primary bg-gradient rounded-pill px-3 py-2 fs-6">
    <i class="bi bi-trophy-fill me-1"></i>รถยอดนิยม
  </span>
  <span class="badge bg-success bg-gradient rounded-pill px-3 py-2 fs-6">
    <i class="bi bi-shield-check me-1"></i>รับประกัน
  </span>
  <span class="badge bg-info bg-gradient rounded-pill px-3 py-2 fs-6">
    <i class="bi bi-fire me-1"></i>ลด 50%
  </span>
</div>`,

    quote: `<div class="bg-light rounded-4 p-4 border-start border-5 border-primary my-4">
  <blockquote class="blockquote mb-3">
    <p class="fs-5 fst-italic mb-0">"ข้อความที่ต้องการอ้างอิงแบบสไตล์ 2025 ที่ดูทันสมัยและสวยงาม"</p>
  </blockquote>
  <div class="d-flex align-items-center">
    <div class="bg-primary bg-gradient rounded-circle p-2 me-3">
      <i class="bi bi-person-fill text-white"></i>
    </div>
    <div>
      <footer class="blockquote-footer mb-0 fw-semibold">แหล่งที่มา</footer>
      <small class="text-muted">ตำแหน่ง, บริษัท</small>
    </div>
  </div>
</div>`,

    hero: `<div class="hero-section bg-gradient text-white rounded-4 p-5 text-center my-4">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="display-4 fw-bold mb-3">🚗 ครูหนึ่งรถสวย 2025</h1>
        <p class="lead mb-4">รถมือสองคุณภาพ ราคาดี บริการมาตรฐาน รับประกันทุกคัน</p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a href="#" class="btn btn-light btn-lg rounded-pill px-4" data-bs-toggle="tooltip" title="ค้นหารถที่ใช่สำหรับคุณ">
            <i class="bi bi-search me-2"></i>ค้นหารถ
          </a>
          <a href="#" class="btn btn-outline-light btn-lg rounded-pill px-4" data-bs-toggle="tooltip" title="ติดต่อเราได้ตลอด 24 ชม.">
            <i class="bi bi-telephone-fill me-2"></i>ติดต่อเรา
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`,

    pricing: `<div class="row g-4 my-4">
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 text-center h-100" data-bs-toggle="tooltip" title="แพ็กเกจเริ่มต้น เหมาะสำหรับการตรวจเช็คพื้นฐาน">
      <div class="card-body p-4">
        <div class="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
          <i class="bi bi-award fs-4 text-muted"></i>
        </div>
        <h4 class="fw-bold">Basic</h4>
        <div class="display-6 fw-bold text-primary">฿15,000</div>
        <p class="text-muted">/ เดือน</p>
        <ul class="list-unstyled text-start">
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>ตรวจเช็คพื้นฐาน</li>
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>รับประกัน 6 เดือน</li>
        </ul>
        <button class="btn btn-outline-primary rounded-pill w-100" data-bs-toggle="popover" data-bs-content="เหมาะสำหรับลูกค้าที่ต้องการบริการพื้นฐาน">เลือกแพ็กเกจ</button>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 text-center h-100 pricing-card-premium">
      <div class="card-body p-4">
        <div class="badge bg-success position-absolute top-0 start-50 translate-middle rounded-pill px-3 py-2">
          <i class="bi bi-star-fill me-1"></i>แนะนำ
        </div>
        <div class="bg-primary bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
          <i class="bi bi-gem fs-4 text-white"></i>
        </div>
        <h4 class="fw-bold">Premium</h4>
        <div class="display-6 fw-bold text-primary">฿25,000</div>
        <p class="text-muted">/ เดือน</p>
        <ul class="list-unstyled text-start">
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>ตรวจเช็คครบถ้วน</li>
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>รับประกัน 1 ปี</li>
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>บริการซ่อม</li>
        </ul>
        <button class="btn btn-primary rounded-pill w-100">เลือกแพ็กเกจ</button>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 shadow-sm rounded-4 text-center h-100">
      <div class="card-body p-4">
        <div class="bg-warning bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
          <i class="bi bi-crown-fill fs-4 text-white"></i>
        </div>
        <h4 class="fw-bold">VIP</h4>
        <div class="display-6 fw-bold text-primary">฿35,000</div>
        <p class="text-muted">/ เดือน</p>
        <ul class="list-unstyled text-start">
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>บริการครบวงจร</li>
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>รับประกัน 2 ปี</li>
          <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>บริการถึงที่</li>
        </ul>
        <button class="btn btn-warning rounded-pill w-100">เลือกแพ็กเกจ</button>
      </div>
    </div>
  </div>
</div>`,
  };

  return (
    <>
      {/* DEBUG: Component is Loading */}
      <div
        style={{
          background: '#e3f2fd',
          padding: '10px',
          border: '2px solid #1976d2',
          marginBottom: '10px',
        }}
      >
        🎯 <strong>Bootstrap Rich Text Editor 2025 โหลดแล้ว!</strong> - Templates
        สไตล์ใหม่พร้อมใช้งาน
      </div>

      {/* Bootstrap CSS CDN - Latest 5.3.2 */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />

      {/* Bootstrap Icons CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      {/* Custom CSS for 2025 Styles */}
      <style jsx>{`
        /* Custom 2025 Enhancements */
        .card {
          transition: all 0.3s ease;
          border: none !important;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .btn {
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .badge {
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
          transform: scale(1.01);
          transition: all 0.2s ease;
        }

        .alert {
          border: none;
          border-left: 4px solid;
        }

        .alert-primary {
          border-left-color: #0d6efd;
          background: linear-gradient(135deg, #e7f3ff 0%, #cce7ff 100%);
        }

        .alert-success {
          border-left-color: #198754;
          background: linear-gradient(135deg, #e8f5e8 0%, #d1edcc 100%);
        }

        .alert-warning {
          border-left-color: #ffc107;
          background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
        }

        .bg-gradient {
          background: linear-gradient(
            135deg,
            var(--bs-primary) 0%,
            var(--bs-primary-dark, #0a58ca) 100%
          ) !important;
        }

        .rounded-4 {
          border-radius: 1rem !important;
        }

        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }

        /* Pricing Card Special Effects */
        .pricing-card-premium {
          position: relative;
          overflow: hidden;
        }

        .pricing-card-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0d6efd, #6610f2, #6f42c1);
        }

        /* Hero Section Animations */
        .hero-section {
          background: linear-gradient(135deg, #0d6efd 0%, #6610f2 50%, #6f42c1 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="50" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }

        /* Custom Scrollbar for Text Areas */
        textarea.form-control::-webkit-scrollbar {
          width: 8px;
        }

        textarea.form-control::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        textarea.form-control::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        textarea.form-control::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Loading Animation */
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .loading {
          animation: pulse 2s infinite;
        }

        /* Template Button Hover Effects */
        .btn-outline-primary:hover,
        .btn-outline-success:hover,
        .btn-outline-info:hover,
        .btn-outline-warning:hover,
        .btn-outline-secondary:hover,
        .btn-outline-dark:hover {
          transform: scale(1.05);
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: all 0.2s ease;
        }
      `}</style>

      {/* Bootstrap Icons SVG Sprites */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="m8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </symbol>
        <symbol id="star-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </symbol>
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </symbol>
        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </symbol>
        <symbol id="arrow-right-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
        </symbol>
        <symbol id="person-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </symbol>
        <symbol id="search" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </symbol>
        <symbol id="telephone-fill" fill="currentColor" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
          />
        </symbol>
      </svg>

      <div className="card">
        {/* Toolbar */}
        <div className="card-header bg-light">
          <div className="row g-2">
            {/* Basic HTML Tags */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertTag('<h2>', '</h2>')}
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  title="หัวข้อใหญ่"
                >
                  H2
                </button>
                <button
                  onClick={() => insertTag('<h3>', '</h3>')}
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  title="หัวข้อย่อย"
                >
                  H3
                </button>
                <button
                  onClick={() => insertTag('<p>', '</p>')}
                  className="btn btn-outline-secondary btn-sm"
                  type="button"
                  title="ย่อหน้า"
                >
                  P
                </button>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertTag('<strong>', '</strong>')}
                  className="btn btn-outline-warning btn-sm fw-bold"
                  type="button"
                  title="ตัวหนา"
                >
                  B
                </button>
                <button
                  onClick={() => insertTag('<em>', '</em>')}
                  className="btn btn-outline-success btn-sm fst-italic"
                  type="button"
                  title="ตัวเอียง"
                >
                  I
                </button>
              </div>
            </div>

            {/* Lists */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertTag('<ul class="list-unstyled">\n  <li>', '</li>\n</ul>')}
                  className="btn btn-outline-info btn-sm"
                  type="button"
                  title="รายการไม่เรียงลำดับ"
                >
                  UL
                </button>
                <button
                  onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
                  className="btn btn-outline-info btn-sm"
                  type="button"
                  title="รายการเรียงลำดับ"
                >
                  OL
                </button>
              </div>
            </div>

            {/* Bootstrap Templates 2025 - แถวที่ 1 */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.alert)}
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  title="Alert 2025 - กล่องแจ้งเตือนแบบใหม่"
                >
                  🎯 Alert
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.card)}
                  className="btn btn-outline-success btn-sm"
                  type="button"
                  title="Card 2025 - การ์ดสไตล์ใหม่"
                >
                  ✨ Card
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.table)}
                  className="btn btn-outline-info btn-sm"
                  type="button"
                  title="Table 2025 - ตารางสวยงาม"
                >
                  📊 Table
                </button>
              </div>
            </div>

            {/* Bootstrap Templates 2025 - แถวที่ 2 */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.columns)}
                  className="btn btn-outline-warning btn-sm"
                  type="button"
                  title="Columns 2025 - เปรียบเทียบข้อดี/ข้อเสีย"
                >
                  � Compare
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.button)}
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  title="Button 2025 - ปุ่มสไตล์ใหม่"
                >
                  � Button
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.badge)}
                  className="btn btn-outline-success btn-sm"
                  type="button"
                  title="Badge 2025 - ป้ายหลากสี"
                >
                  🏷️ Badge
                </button>
              </div>
            </div>

            {/* Bootstrap Templates 2025 - แถวที่ 3 */}
            <div className="col-auto">
              <div className="btn-group" role="group">
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.quote)}
                  className="btn btn-outline-secondary btn-sm"
                  type="button"
                  title="Quote 2025 - ข้อความอ้างอิงสวยงาม"
                >
                  💬 Quote
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.hero)}
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                  title="Hero 2025 - หัวข้อใหญ่สะดุดตา"
                >
                  🎪 Hero
                </button>
                <button
                  onClick={() => insertBootstrapTemplate(bootstrapTemplates.pricing)}
                  className="btn btn-outline-warning btn-sm"
                  type="button"
                  title="Pricing 2025 - ตารางราคาสวยงาม"
                >
                  � Price
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="col-auto">
              <button
                onClick={() => setShowImageGallery(!showImageGallery)}
                className={`btn btn-sm ${showImageGallery ? 'btn-success' : 'btn-outline-primary'}`}
                type="button"
                title="เพิ่มรูปภาพ"
              >
                🖼️ รูปภาพ
              </button>
            </div>

            {/* Preview Toggle */}
            <div className="col-auto">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`btn btn-sm ${isPreview ? 'btn-warning' : 'btn-outline-secondary'}`}
                type="button"
              >
                {isPreview ? '📝 แก้ไข' : '👁️ ตัวอย่าง'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="card-body" style={{ minHeight: '400px' }}>
          {isPreview ? (
            <div
              className="border rounded p-3"
              style={{ minHeight: '350px' }}
              dangerouslySetInnerHTML={{ __html: processImagesInContent(value) }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="form-control"
              style={{
                height: '350px',
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '14px',
              }}
            />
          )}
        </div>

        {/* Image Gallery */}
        {showImageGallery && articleId && (
          <div className="card-footer">
            <ImageGallery articleId={articleId} onImageSelect={handleImageSelect} />
          </div>
        )}

        {/* Help */}
        <div className="card-footer bg-light">
          <small className="text-muted">
            <strong>🎨 Bootstrap Templates 2025:</strong> เลือกข้อความแล้วคลิกปุ่ม HTML (H2, H3, B,
            I) | คลิกปุ่ม Templates สไตล์ 2025 | คลิก &ldquo;รูปภาพ&rdquo; เพื่อแทรกรูป | คลิก
            &ldquo;ตัวอย่าง&rdquo; เพื่อดูผลลัพธ์
            <br />
            <strong>🚀 Templates ใหม่ 2025:</strong> Alert (แจ้งเตือนสวย) | Card (การ์ดทันสมัย) |
            Table (ตารางสี) | Compare (เปรียบเทียบ) | Button (ปุ่มสวย) | Badge (ป้ายหลากสี) | Quote
            (อ้างอิงสวย) | Hero (หัวข้อใหญ่) | Price (ตารางราคา)
          </small>
        </div>
      </div>

      {/* Bootstrap JS CDN - Latest 5.3.2 */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
        defer
      />

      {/* Custom JavaScript for 2025 Enhancements */}
      <script defer>{`
        // Initialize Bootstrap components when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
          // Initialize all tooltips
          var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
          var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
          });
          
          // Initialize all popovers
          var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
          var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
          });
          
          // Add smooth scrolling for anchor links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                e.preventDefault();
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            });
          });
          
          // Add click animation to buttons
          document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
              let ripple = document.createElement('span');
              ripple.classList.add('ripple');
              this.appendChild(ripple);
              
              let x = e.clientX - e.target.offsetLeft;
              let y = e.clientY - e.target.offsetTop;
              
              ripple.style.left = x + 'px';
              ripple.style.top = y + 'px';
              
              setTimeout(() => {
                ripple.remove();
              }, 600);
            });
          });
          
          // Auto-resize textareas
          document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', function() {
              this.style.height = 'auto';
              this.style.height = this.scrollHeight + 'px';
            });
          });
          
          // Add loading states to form submissions
          document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function() {
              const submitBtn = this.querySelector('button[type="submit"]');
              if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังบันทึก...';
                
                // Re-enable after 3 seconds (for demo purposes)
                setTimeout(() => {
                  submitBtn.classList.remove('loading');
                  submitBtn.disabled = false;
                  submitBtn.textContent = originalText;
                }, 3000);
              }
            });
          });
          
          // Add parallax effect to hero sections
          window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.hero-section');
            
            parallax.forEach(element => {
              const speed = 0.5;
              element.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
            });
          });
          
          // Add intersection observer for fade-in animations
          const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          };
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeInUp');
              }
            });
          }, observerOptions);
          
          // Observe all cards and alerts
          document.querySelectorAll('.card, .alert').forEach(el => {
            observer.observe(el);
          });
          
          // Add copy-to-clipboard functionality for code blocks
          document.querySelectorAll('pre code').forEach(block => {
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2';
            button.innerHTML = '<i class="bi bi-clipboard"></i>';
            button.title = 'Copy to clipboard';
            
            button.addEventListener('click', () => {
              navigator.clipboard.writeText(block.textContent).then(() => {
                button.innerHTML = '<i class="bi bi-check"></i>';
                setTimeout(() => {
                  button.innerHTML = '<i class="bi bi-clipboard"></i>';
                }, 2000);
              });
            });
            
            block.parentElement.style.position = 'relative';
            block.parentElement.appendChild(button);
          });
          
          console.log('🎉 Bootstrap 2025 Enhanced Features Loaded!');
        });
        
        // CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = \`
          .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
          }
          
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          .animate__fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        \`;
        document.head.appendChild(style);
      `}</script>
    </>
  );
};

export default BootstrapRichTextEditor;
