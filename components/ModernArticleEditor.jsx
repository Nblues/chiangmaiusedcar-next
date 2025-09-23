/**
 * Modern Article Editor 2025 - เครื่องมือแก้ไขบทความทันสมัย
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * ระบบแก้ไขบทความสไตล์ Modern UI/UX 2025
 */

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import เพื่อป้องกัน SSR
const ImageGallery = dynamic(() => import('./ImageGallery'), { ssr: false });

const ModernArticleEditor = ({
  value,
  onChange,
  placeholder = 'เขียนเนื้อหาบทความ...',
  articleId,
}) => {
  const [activeMode, setActiveMode] = useState('write'); // write, preview, split
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);

  // Templates สำเร็จรูป 2025
  const modernTemplates = {
    // ✨ Layout Templates
    hero: {
      name: '🌟 Hero Section',
      category: 'Layout',
      description: 'หัวข้อใหญ่สำหรับเริ่มต้นบทความ',
      html: `<div class="hero-section bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8 rounded-2xl mb-8 text-center">
  <h1 class="text-5xl font-bold mb-4">🚗 หัวข้อบทความสำคัญ</h1>
  <p class="text-xl opacity-90 mb-6">คำอธิบายสั้นๆ ที่น่าสนใจ และดึงดูดใจผู้อ่าน</p>
  <div class="flex justify-center gap-4">
    <button class="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
      <i class="bi bi-arrow-right-circle-fill me-2"></i>อ่านต่อ
    </button>
    <button class="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all">
      <i class="bi bi-share-fill me-2"></i>แชร์
    </button>
  </div>
</div>`,
    },

    article: {
      name: '📰 Article Layout',
      category: 'Layout',
      description: 'โครงสร้างบทความมาตรฐาน',
      html: `<article class="max-w-4xl mx-auto">
  <header class="mb-8">
    <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <i class="bi bi-calendar3"></i>
      <time datetime="2025-09-16">16 กันยายน 2025</time>
      <span class="mx-2">•</span>
      <i class="bi bi-clock"></i>
      <span>5 นาทีในการอ่าน</span>
    </div>
    <h1 class="text-4xl font-bold text-gray-900 mb-4">หัวข้อบทความหลัก</h1>
    <p class="text-xl text-gray-600 leading-relaxed">สรุปเนื้อหาสำคัญของบทความ ที่จะทำให้ผู้อ่านเข้าใจภาพรวม</p>
  </header>
  
  <div class="prose prose-lg max-w-none">
    <p>เนื้อหาบทความเริ่มต้นที่นี่...</p>
    
    <h2>หัวข้อย่อยที่ 1</h2>
    <p>รายละเอียดภายใต้หัวข้อย่อย...</p>
    
    <h2>หัวข้อย่อยที่ 2</h2>
    <p>เนื้อหาเพิ่มเติม...</p>
  </div>
</article>`,
    },

    // 🎨 Content Templates
    comparison: {
      name: '⚖️ Comparison',
      category: 'Content',
      description: 'เปรียบเทียบข้อมูล 2 ฝั่ง',
      html: `<div class="comparison-container bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
  <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 text-center">
    <h3 class="text-2xl font-bold"><i class="bi bi-compare me-2"></i>เปรียบเทียบ</h3>
  </div>
  
  <div class="grid md:grid-cols-2 gap-0">
    <!-- ฝั่งซ้าย -->
    <div class="p-8 border-r">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="bi bi-check-lg text-white text-2xl"></i>
        </div>
        <h4 class="text-xl font-bold text-green-600">ทางเลือกที่ 1</h4>
      </div>
      
      <ul class="space-y-3">
        <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 me-3"></i>ข้อดีที่ 1</li>
        <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 me-3"></i>ข้อดีที่ 2</li>
        <li class="flex items-center"><i class="bi bi-check-circle-fill text-green-500 me-3"></i>ข้อดีที่ 3</li>
      </ul>
    </div>
    
    <!-- ฝั่งขวา -->
    <div class="p-8">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="bi bi-x-lg text-white text-2xl"></i>
        </div>
        <h4 class="text-xl font-bold text-orange-600">ทางเลือกที่ 2</h4>
      </div>
      
      <ul class="space-y-3">
        <li class="flex items-center"><i class="bi bi-x-circle-fill text-orange-500 me-3"></i>ข้อด้อยที่ 1</li>
        <li class="flex items-center"><i class="bi bi-x-circle-fill text-orange-500 me-3"></i>ข้อด้อยที่ 2</li>
        <li class="flex items-center"><i class="bi bi-x-circle-fill text-orange-500 me-3"></i>ข้อด้อยที่ 3</li>
      </ul>
    </div>
  </div>
</div>`,
    },

    timeline: {
      name: '📅 Timeline',
      category: 'Content',
      description: 'เส้นเวลา/ขั้นตอน',
      html: `<div class="timeline-container mb-8">
  <h3 class="text-2xl font-bold text-center mb-8">
    <i class="bi bi-clock-history me-2"></i>เส้นเวลาและขั้นตอน
  </h3>
  
  <div class="relative">
    <!-- เส้นกลาง -->
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
    
    <!-- Step 1 -->
    <div class="relative flex items-start mb-8">
      <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">1</div>
      <div class="ml-6 bg-white rounded-lg shadow-lg p-6 flex-1">
        <h4 class="font-bold text-lg mb-2">ขั้นตอนที่ 1</h4>
        <p class="text-gray-600">รายละเอียดของขั้นตอนแรก</p>
      </div>
    </div>
    
    <!-- Step 2 -->
    <div class="relative flex items-start mb-8">
      <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">2</div>
      <div class="ml-6 bg-white rounded-lg shadow-lg p-6 flex-1">
        <h4 class="font-bold text-lg mb-2">ขั้นตอนที่ 2</h4>
        <p class="text-gray-600">รายละเอียดของขั้นตอนที่สอง</p>
      </div>
    </div>
    
    <!-- Step 3 -->
    <div class="relative flex items-start">
      <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">3</div>
      <div class="ml-6 bg-white rounded-lg shadow-lg p-6 flex-1">
        <h4 class="font-bold text-lg mb-2">ขั้นตอนที่ 3</h4>
        <p class="text-gray-600">รายละเอียดของขั้นตอนสุดท้าย</p>
      </div>
    </div>
  </div>
</div>`,
    },

    // 🏪 Business Templates
    pricing: {
      name: '💰 Pricing Card',
      category: 'Business',
      description: 'การ์ดราคาสินค้า/บริการ',
      html: `<div class="pricing-section mb-8">
  <h3 class="text-3xl font-bold text-center mb-8">💰 แพ็คเกจราคา</h3>
  
  <div class="grid md:grid-cols-3 gap-6">
    <!-- Basic -->
    <div class="pricing-card bg-white rounded-2xl shadow-lg p-8 text-center border">
      <h4 class="text-xl font-bold mb-4">📦 Basic</h4>
      <div class="mb-6">
        <span class="text-4xl font-bold text-blue-600">฿999</span>
        <span class="text-gray-500">/เดือน</span>
      </div>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>ฟีเจอร์ 1</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>ฟีเจอร์ 2</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>ฟีเจอร์ 3</li>
      </ul>
      <button class="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">เลือกแพ็คเกจ</button>
    </div>
    
    <!-- Pro -->
    <div class="pricing-card bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 text-center transform scale-105 relative">
      <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">แนะนำ</div>
      <h4 class="text-xl font-bold mb-4">🚀 Pro</h4>
      <div class="mb-6">
        <span class="text-4xl font-bold">฿1,999</span>
        <span class="opacity-75">/เดือน</span>
      </div>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center justify-center"><i class="bi bi-check text-yellow-300 me-2"></i>ฟีเจอร์ทั้งหมดใน Basic</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-yellow-300 me-2"></i>ฟีเจอร์พิเศษ 1</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-yellow-300 me-2"></i>ฟีเจอร์พิเศษ 2</li>
      </ul>
      <button class="w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">เลือกแพ็คเกจ</button>
    </div>
    
    <!-- Enterprise -->
    <div class="pricing-card bg-white rounded-2xl shadow-lg p-8 text-center border">
      <h4 class="text-xl font-bold mb-4">🏢 Enterprise</h4>
      <div class="mb-6">
        <span class="text-4xl font-bold text-gray-900">Custom</span>
      </div>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>ฟีเจอร์ทั้งหมด</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>การสนับสนุน 24/7</li>
        <li class="flex items-center justify-center"><i class="bi bi-check text-green-500 me-2"></i>ปรับแต่งเฉพาะ</li>
      </ul>
      <button class="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">ติดต่อเรา</button>
    </div>
  </div>
</div>`,
    },

    // 🎯 Interactive Templates
    tabs: {
      name: '📁 Tabs',
      category: 'Interactive',
      description: 'แท็บสำหรับจัดกลุ่มเนื้อหา',
      html: `<div class="tabs-container mb-8">
  <div class="tab-buttons flex border-b border-gray-200 mb-6">
    <button class="tab-btn active px-6 py-3 font-semibold text-blue-600 border-b-2 border-blue-600" data-tab="tab1">
      <i class="bi bi-house-fill me-2"></i>แท็บที่ 1
    </button>
    <button class="tab-btn px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition-colors" data-tab="tab2">
      <i class="bi bi-gear-fill me-2"></i>แท็บที่ 2
    </button>
    <button class="tab-btn px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition-colors" data-tab="tab3">
      <i class="bi bi-person-fill me-2"></i>แท็บที่ 3
    </button>
  </div>
  
  <div class="tab-content">
    <div id="tab1" class="tab-pane active">
      <div class="bg-blue-50 rounded-lg p-6">
        <h4 class="font-bold text-lg mb-3">เนื้อหาแท็บที่ 1</h4>
        <p class="text-gray-700">รายละเอียดสำหรับแท็บแรก...</p>
      </div>
    </div>
    
    <div id="tab2" class="tab-pane hidden">
      <div class="bg-green-50 rounded-lg p-6">
        <h4 class="font-bold text-lg mb-3">เนื้อหาแท็บที่ 2</h4>
        <p class="text-gray-700">รายละเอียดสำหรับแท็บที่สอง...</p>
      </div>
    </div>
    
    <div id="tab3" class="tab-pane hidden">
      <div class="bg-purple-50 rounded-lg p-6">
        <h4 class="font-bold text-lg mb-3">เนื้อหาแท็บที่ 3</h4>
        <p class="text-gray-700">รายละเอียดสำหรับแท็บที่สาม...</p>
      </div>
    </div>
  </div>
</div>

<script>
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
      b.classList.add('text-gray-600');
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.add('hidden');
      p.classList.remove('active');
    });
    
    // Add active to clicked
    btn.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
    btn.classList.remove('text-gray-600');
    document.getElementById(btn.dataset.tab).classList.remove('hidden');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
</script>`,
    },

    accordion: {
      name: '📋 Accordion',
      category: 'Interactive',
      description: 'กล่องข้อมูลที่เปิด-ปิดได้',
      html: `<div class="accordion-container mb-8">
  <h3 class="text-2xl font-bold mb-6"><i class="bi bi-question-circle-fill me-2"></i>คำถามที่พบบ่อย</h3>
  
  <div class="space-y-4">
    <!-- Item 1 -->
    <div class="accordion-item bg-white rounded-lg shadow border">
      <button class="accordion-header w-full text-left p-6 font-semibold text-lg flex justify-between items-center hover:bg-gray-50">
        คำถามที่ 1: นี่คือตัวอย่างคำถาม?
        <i class="bi bi-chevron-down transition-transform"></i>
      </button>
      <div class="accordion-content hidden p-6 pt-0 text-gray-700">
        <p>คำตอบสำหรับคำถามที่ 1 จะอยู่ที่นี่ สามารถเขียนรายละเอียดได้อย่างครบถ้วน</p>
      </div>
    </div>
    
    <!-- Item 2 -->
    <div class="accordion-item bg-white rounded-lg shadow border">
      <button class="accordion-header w-full text-left p-6 font-semibold text-lg flex justify-between items-center hover:bg-gray-50">
        คำถามที่ 2: อีกหนึ่งคำถามที่น่าสนใจ?
        <i class="bi bi-chevron-down transition-transform"></i>
      </button>
      <div class="accordion-content hidden p-6 pt-0 text-gray-700">
        <p>คำตอบสำหรับคำถามที่ 2 พร้อมรายละเอียดเพิ่มเติม</p>
      </div>
    </div>
    
    <!-- Item 3 -->
    <div class="accordion-item bg-white rounded-lg shadow border">
      <button class="accordion-header w-full text-left p-6 font-semibold text-lg flex justify-between items-center hover:bg-gray-50">
        คำถามที่ 3: คำถามสุดท้าย?
        <i class="bi bi-chevron-down transition-transform"></i>
      </button>
      <div class="accordion-content hidden p-6 pt-0 text-gray-700">
        <p>คำตอบสำหรับคำถามที่ 3 ที่ครอบคลุมและเข้าใจง่าย</p>
      </div>
    </div>
  </div>
</div>

<script>
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    const isOpen = !content.classList.contains('hidden');
    
    if (isOpen) {
      content.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    } else {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  });
});
</script>`,
    },
  };

  // ฟังก์ชันแทรก template
  const insertTemplate = templateKey => {
    const template = modernTemplates[templateKey];
    if (!template) return;

    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + '\n\n' + template.html + '\n\n');
      return;
    }

    const start = textarea.selectionStart;
    const newText =
      value.substring(0, start) + '\n\n' + template.html + '\n\n' + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + template.html.length + 4;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

  // Group templates by category
  const templatesByCategory = Object.entries(modernTemplates).reduce((acc, [key, template]) => {
    if (!acc[template.category]) acc[template.category] = [];
    acc[template.category].push({ key, ...template });
    return acc;
  }, {});

  return (
    <div className={`modern-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      {/* Modern CSS Styles */}
      <style jsx>{`
        .modern-editor {
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        .editor-toolbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px 12px 0 0;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .mode-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .mode-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
        }

        .mode-btn.active {
          background: white;
          color: #667eea;
          shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .mode-btn:not(.active) {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .mode-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .template-btn {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .template-btn:hover {
          border-color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .template-name {
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          color: #2d3748;
        }

        .template-desc {
          font-size: 0.75rem;
          color: #718096;
          line-height: 1.3;
        }

        .editor-content {
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .editor-textarea {
          width: 100%;
          min-height: 500px;
          padding: 2rem;
          border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          background: #fafafa;
        }

        .editor-textarea:focus {
          outline: none;
          background: white;
        }

        .preview-content {
          padding: 2rem;
          background: white;
          min-height: 500px;
          max-height: 600px;
          overflow-y: auto;
        }

        .category-section {
          margin-bottom: 1rem;
        }

        .category-title {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        .floating-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .template-btn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Floating Actions */}
      <div className="floating-actions">
        <button
          className="action-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'โหมดเต็มจอ'}
        >
          <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
        </button>
        <button className="action-btn" onClick={() => setShowImageGallery(true)} title="แทรกรูปภาพ">
          <i className="bi bi-image"></i>
        </button>
      </div>

      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Mode Selection */}
        <div className="mode-buttons">
          <button
            className={`mode-btn ${activeMode === 'write' ? 'active' : ''}`}
            onClick={() => setActiveMode('write')}
          >
            <i className="bi bi-pencil-fill me-2"></i>เขียน
          </button>
          <button
            className={`mode-btn ${activeMode === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveMode('preview')}
          >
            <i className="bi bi-eye-fill me-2"></i>ตัวอย่าง
          </button>
          <button
            className={`mode-btn ${activeMode === 'split' ? 'active' : ''}`}
            onClick={() => setActiveMode('split')}
          >
            <i className="bi bi-layout-split me-2"></i>แยกหน้าจอ
          </button>
        </div>

        {/* Template Selector */}
        {activeMode === 'write' && (
          <div>
            {Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category} className="category-section">
                <div className="category-title">{category} Templates</div>
                <div className="template-grid">
                  {templates.map(template => (
                    <button
                      key={template.key}
                      className="template-btn"
                      onClick={() => insertTemplate(template.key)}
                      title={template.description}
                    >
                      <div className="template-name">{template.name}</div>
                      <div className="template-desc">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="editor-content">
        {activeMode === 'write' && (
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}

        {activeMode === 'preview' && (
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: value }} />
        )}

        {activeMode === 'split' && (
          <div className="grid grid-cols-2 h-full">
            <textarea
              ref={textareaRef}
              className="editor-textarea border-r"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
            />
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: value }} />
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <ImageGallery
          isOpen={showImageGallery}
          onClose={() => setShowImageGallery(false)}
          onImageSelect={imgTag => {
            const textarea = textareaRef.current;
            if (!textarea) {
              onChange(value + '\n\n' + imgTag);
            } else {
              const start = textarea.selectionStart;
              const newText = value.substring(0, start) + imgTag + value.substring(start);
              onChange(newText);

              setTimeout(() => {
                if (textarea) {
                  textarea.focus();
                  const newPosition = start + imgTag.length;
                  textarea.setSelectionRange(newPosition, newPosition);
                }
              }, 10);
            }
            setShowImageGallery(false);
          }}
          articleId={articleId}
        />
      )}
    </div>
  );
};

export default ModernArticleEditor;
