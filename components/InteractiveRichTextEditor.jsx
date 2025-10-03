/**
 * Interactive Rich Text Editor Component with Drag & Drop + Resize
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * ระบบแก้ไขข้อความแบบ WYSIWYG พร้อมการลากรูปและยืดหดขนาด
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import ImageGallery from './ImageGallery';
import { processImagesInContent } from '../lib/imageUtils';

const InteractiveRichTextEditor = ({
  value,
  onChange,
  placeholder = 'เขียนเนื้อหาบทความ...',
  articleId,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [draggedImage, setDraggedImage] = useState(null);
  const [resizing, setResizing] = useState(false);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  // ฟังก์ชันสำหรับแทรกรูปภาพจาก Gallery
  const handleImageSelect = imgTag => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + imgTag + value.substring(start);
    onChange(newText);

    setShowImageGallery(false);
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + imgTag.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 10);
  };

  // ฟังก์ชันสำหรับแทรก HTML tags
  const insertTag = (openTag, closeTag = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + openTag.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 10);
  };

  // ฟังก์ชันสำหรับการจัดการการลากรูป
  const handleImageDragStart = (e, imgElement) => {
    setDraggedImage(imgElement);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = e => {
    e.preventDefault();
    if (!draggedImage) return;

    const dropTarget = e.target.closest('p, div, h1, h2, h3, h4, h5, h6');
    if (dropTarget && previewRef.current?.contains(dropTarget)) {
      // หา position ในข้อความ
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        // แปลง DOM position เป็น text position
        const walker = document.createTreeWalker(
          previewRef.current,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        let textOffset = 0;
        let node;
        while ((node = walker.nextNode())) {
          if (node === range.startContainer) {
            textOffset += range.startOffset;
            break;
          }
          textOffset += node.textContent.length;
        }

        // ลบรูปจากตำแหน่งเดิม
        const imgSrc = draggedImage.src;
        const imgRegex = new RegExp(
          `<img[^>]*src=["']${imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`,
          'g'
        );
        let newContent = value.replace(imgRegex, '');

        // แทรกรูปในตำแหน่งใหม่
        const imgTag = `<img src="${imgSrc}" alt="รูปภาพบทความ" style="max-width: ${draggedImage.style.maxWidth || '300px'}; height: auto; margin: 10px;" draggable="true" />`;
        newContent =
          newContent.substring(0, textOffset) + imgTag + newContent.substring(textOffset);

        onChange(newContent);
      }
    }
    setDraggedImage(null);
  };

  // ฟังก์ชันสำหรับการยืดหดขนาดรูป
  const handleImageResize = useCallback(
    (imgElement, newWidth) => {
      const imgSrc = imgElement.src;
      const imgRegex = new RegExp(
        `(<img[^>]*src=["']${imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*style=["'][^"']*)(max-width: [^;]*)(;[^"']*["'])`,
        'g'
      );

      const newContent = value.replace(imgRegex, `$1max-width: ${newWidth}px$3`);
      onChange(newContent);
    },
    [value, onChange]
  );

  // ฟังก์ชันสำหรับสร้าง resize handles
  const addResizeHandles = useCallback(() => {
    if (!previewRef.current) return;

    const images = previewRef.current.querySelectorAll('img');
    images.forEach(img => {
      // ลบ handles เก่า
      const existingWrapper = img.parentElement;
      if (existingWrapper?.classList.contains('resizable-image-wrapper')) {
        existingWrapper.replaceWith(img);
      }

      // สร้าง wrapper ใหม่
      const wrapper = document.createElement('div');
      wrapper.className = 'resizable-image-wrapper';
      wrapper.style.cssText = `
        position: relative;
        display: inline-block;
        border: 2px dashed transparent;
        transition: border-color 0.2s;
      `;

      // สร้าง resize handle
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: se-resize;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      `;

      // Event listeners สำหรับ resize
      let startX, startWidth;

      resizeHandle.addEventListener('mousedown', e => {
        e.preventDefault();
        setResizing(true);
        startX = e.clientX;
        startWidth = parseInt(getComputedStyle(img).width);

        const mouseMoveHandler = e => {
          const dx = e.clientX - startX;
          const newWidth = Math.max(100, Math.min(800, startWidth + dx));
          img.style.maxWidth = newWidth + 'px';
          img.style.width = newWidth + 'px';
        };

        const mouseUpHandler = () => {
          setResizing(false);
          const finalWidth = parseInt(img.style.width);
          handleImageResize(img, finalWidth);
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });

      // Hover effects
      wrapper.addEventListener('mouseenter', () => {
        if (!resizing) {
          wrapper.style.borderColor = '#3b82f6';
          resizeHandle.style.opacity = '1';
        }
      });

      wrapper.addEventListener('mouseleave', () => {
        if (!resizing) {
          wrapper.style.borderColor = 'transparent';
          resizeHandle.style.opacity = '0';
        }
      });

      // เพิ่ม drag functionality
      img.draggable = true;
      img.addEventListener('dragstart', e => handleImageDragStart(e, img));

      // Wrap image
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      wrapper.appendChild(resizeHandle);
    });
  }, [resizing, handleImageResize]);

  // Update preview และเพิ่ม resize handles
  useEffect(() => {
    if (isPreview) {
      setTimeout(() => {
        addResizeHandles();
      }, 100);
    }
  }, [isPreview, value, addResizeHandles]);

  // Toolbar buttons
  const toolbarButtons = [
    {
      label: 'H2',
      onClick: () => insertTag('<h2>', '</h2>'),
      className: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      label: 'H3',
      onClick: () => insertTag('<h3>', '</h3>'),
      className: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      label: 'P',
      onClick: () => insertTag('<p>', '</p>'),
      className: 'bg-gray-100 hover:bg-gray-200',
    },
    {
      label: 'B',
      onClick: () => insertTag('<strong>', '</strong>'),
      className: 'bg-yellow-100 hover:bg-yellow-200 font-bold',
    },
    {
      label: 'I',
      onClick: () => insertTag('<em>', '</em>'),
      className: 'bg-green-100 hover:bg-green-200 italic',
    },
    {
      label: 'UL',
      onClick: () => insertTag('<ul>\n  <li>', '</li>\n</ul>'),
      className: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      label: 'OL',
      onClick: () => insertTag('<ol>\n  <li>', '</li>\n</ol>'),
      className: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      label: 'LI',
      onClick: () => insertTag('<li>', '</li>'),
      className: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      label: 'Table',
      onClick: () =>
        insertTag(
          '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">\n  <tr>\n    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">หัวข้อ 1</th>\n    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">หัวข้อ 2</th>\n  </tr>\n  <tr>\n    <td style="border: 1px solid #ddd; padding: 8px;">ข้อมูล 1</td>\n    <td style="border: 1px solid #ddd; padding: 8px;">ข้อมูล 2</td>\n  </tr>\n</table>'
        ),
      className: 'bg-indigo-100 hover:bg-indigo-200',
    },
    {
      label: 'Clear',
      onClick: () => insertTag('<div style="clear: both; margin: 20px 0;"></div>'),
      className: 'bg-red-100 hover:bg-red-200',
      title: 'ล้างการจัดวางรูป (Clear Float)',
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden interactive-rich-editor">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-2 editor-toolbar">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`px-3 py-1 text-sm rounded border ${button.className} transition-colors`}
            type="button"
            title={button.title || button.label}
          >
            {button.label}
          </button>
        ))}

        {/* Image Gallery Button */}
        <button
          onClick={() => setShowImageGallery(!showImageGallery)}
          className={`px-4 py-2 text-sm rounded border transition-colors font-semibold ${
            showImageGallery
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300'
          }`}
          type="button"
          title="เพิ่มรูปภาพ (Insert Image)"
        >
          🖼️ แทรกรูป
        </button>

        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            isPreview ? 'bg-green-200 text-green-800' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          type="button"
        >
          {isPreview ? '📝 แก้ไข' : '👁️ ตัวอย่าง'}
        </button>

        {/* Interactive Mode Indicator */}
        {isPreview && (
          <div className="px-3 py-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded border border-purple-200 flex items-center gap-1">
            <span>🎮</span>
            <span>โหมดโต้ตอบ: ลากและยืดหดรูปได้</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] editor-content-area">
        {isPreview ? (
          <div
            ref={previewRef}
            className={`p-4 prose max-w-none editor-preview mode-transition ${resizing ? 'resizing' : ''}`}
            onDragOver={handleImageDragOver}
            onDrop={handleImageDrop}
            dangerouslySetInnerHTML={{ __html: processImagesInContent(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[400px] p-4 resize-none border-0 focus:outline-none font-mono text-sm mode-transition"
          />
        )}
      </div>

      {/* Image Gallery */}
      {showImageGallery && articleId && (
        <div className="border-t">
          <ImageGallery articleId={articleId} onImageSelect={handleImageSelect} />
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 border-t p-3 text-xs text-gray-600 editor-help-text">
        <strong>วิธีใช้:</strong> เลือกข้อความแล้วคลิกปุ่ม HTML tag ที่ต้องการ | คลิก
        &ldquo;แทรกรูป&rdquo; เพื่อเพิ่มรูปภาพ | คลิก &ldquo;ตัวอย่าง&rdquo; เพื่อโหมดโต้ตอบ
        <br />
        <strong>โหมดโต้ตอบ:</strong> ลากรูปเพื่อย้ายตำแหน่ง |
        วางเมาส์เหนือรูปแล้วลากมุมล่างขวาเพื่อยืดหดขนาด
      </div>

      {/* CSS สำหรับ Interactive Features */}
      <style jsx>{`
        .resizable-image-wrapper img {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .resizable-image-wrapper:hover {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        .resize-handle:hover {
          background: #1d4ed8;
          transform: scale(1.2);
        }

        .prose img {
          cursor: grab;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .prose img:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .prose img:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default InteractiveRichTextEditor;
