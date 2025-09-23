/**
 * Rich Text Editor Component
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * ระบบแก้ไขข้อความแบบ Rich Text พร้อมรองรับ HTML tags
 */

import { useState, useRef } from 'react';
import ImageGallery from './ImageGallery';
import { processImagesInContent } from '../lib/imageUtils';

const RichTextEditor = ({ value, onChange, placeholder = 'เขียนเนื้อหาบทความ...', articleId }) => {
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

    // ปิด Gallery และโฟกัสกลับที่ textarea
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

    // ตั้งตำแหน่ง cursor
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPosition = start + openTag.length + selectedText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  };

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
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-2">
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
          �️ แทรกรูป
        </button>

        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            isPreview ? 'bg-green-200 text-green-800' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          type="button"
        >
          {isPreview ? '📝 แก้ไข' : '👁️ ดูตัวอย่าง'}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div
            className="p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: processImagesInContent(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[400px] p-4 resize-none border-0 focus:outline-none font-mono text-sm"
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
      <div className="bg-gray-50 border-t p-3 text-xs text-gray-600">
        <strong>วิธีใช้:</strong> เลือกข้อความแล้วคลิกปุ่ม HTML tag ที่ต้องการ | คลิก
        &ldquo;รูปภาพ&rdquo; เพื่ือแทรกรูป | คลิก &ldquo;ดูตัวอย่าง&rdquo; เพื่อดูผลลัพธ์
      </div>
    </div>
  );
};

export default RichTextEditor;
