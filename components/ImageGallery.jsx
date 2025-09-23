/**
 * Image Gallery Manager Component
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * คอมโพเนนต์สำหรับจัดการรูปภาพในบทความ
 */

import { useState, useEffect } from 'react';
import {
  getArticleImages,
  deleteImageFromStorage,
  isValidImageFile,
  resizeImage,
  saveImageToStorage,
} from '../lib/imageUtils';

const ImageGallery = ({ articleId, onImageSelect, selectMode = false }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // โหลดรูปภาพเมื่อเปิดหน้า
  useEffect(() => {
    const loadImages = () => {
      const articleImages = getArticleImages(articleId);
      setImages(articleImages);
    };

    if (articleId) {
      loadImages();
    }
  }, [articleId]);

  const loadImages = () => {
    const articleImages = getArticleImages(articleId);
    setImages(articleImages);
  };

  // อัปโหลดรูปภาพ
  const handleFileUpload = async event => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (!isValidImageFile(file)) {
          alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ หรือมีขนาดใหญ่เกิน 5MB`);
          continue;
        }

        // ปรับขนาดรูปภาพ
        const resizedFile = await resizeImage(file);

        // บันทึกรูปภาพ
        await saveImageToStorage(resizedFile || file, articleId);
      }

      // โหลดรายการรูปภาพใหม่
      loadImages();
      alert('อัปโหลดรูปภาพสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ลบรูปภาพ
  const handleDeleteImage = imageName => {
    if (confirm('ต้องการลบรูปภาพนี้หรือไม่?')) {
      deleteImageFromStorage(imageName);
      loadImages();
    }
  };

  // เลือกรูปภาพเพื่อแทรกในบทความ
  const handleSelectImage = image => {
    if (selectMode) {
      // สำหรับ selectMode (เลือกรูปปก) ส่งกลับ data URL
      onImageSelect?.(image.data);
    } else {
      // สำหรับ Rich Text Editor แสดงตัวเลือกการแทรก
      setCurrentImage(image);
      setShowImageOptions(true);
    }
  };

  // Quick Insert - แทรกรูปด้วยรูปแบบมาตรฐาน
  const quickInsertImage = (image, preset) => {
    const presets = {
      'small-left': {
        size: 'small',
        alignment: 'left',
        caption: '',
      },
      'small-right': {
        size: 'small',
        alignment: 'right',
        caption: '',
      },
      'medium-center': {
        size: 'medium',
        alignment: 'center',
        caption: '',
      },
      'large-center': {
        size: 'large',
        alignment: 'center',
        caption: '',
      },
    };

    const config = presets[preset];
    if (config) {
      setCurrentImage(image);
      insertImageWithOptions(config.size, config.alignment, config.caption);
    }
  };

  // แทรกรูปภาพด้วยขนาดและรูปแบบที่เลือก
  const insertImageWithOptions = (size, alignment, caption = '') => {
    if (!currentImage) return;

    const sizeStyles = {
      small: 'max-width: 300px; width: 100%;',
      medium: 'max-width: 600px; width: 100%;',
      large: 'max-width: 100%; width: 100%;',
      thumbnail: 'max-width: 150px; width: 100%;',
      fullwidth: 'width: 100%;',
    };

    const alignmentStyles = {
      left: 'float: left; margin: 0 30px 20px 0; clear: left;',
      right: 'float: right; margin: 0 0 20px 30px; clear: right;',
      center: 'display: block; margin: 30px auto; clear: both;',
      inline: 'display: inline-block; margin: 15px 10px; vertical-align: top;',
    };

    const baseStyle = `${sizeStyles[size]} ${alignmentStyles[alignment]} height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;

    let imgHTML;

    if (caption) {
      // รูปแบบ Figure + Figcaption (มาตรฐาน HTML5)
      imgHTML = `<figure style="margin: 30px 0; ${alignment === 'center' ? 'text-align: center;' : ''} ${alignment === 'left' ? 'float: left; margin: 0 30px 20px 0; clear: left;' : ''} ${alignment === 'right' ? 'float: right; margin: 0 0 20px 30px; clear: right;' : ''}">
  <img src="${currentImage.data}" alt="${currentImage.name}" style="${sizeStyles[size]} height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />
  <figcaption style="font-size: 14px; color: #666; margin-top: 8px; font-style: italic; padding: 0 10px; line-height: 1.4;">${caption}</figcaption>
</figure>`;
    } else {
      // รูปแบบ IMG ธรรมดา
      imgHTML = `<img src="${currentImage.data}" alt="${currentImage.name}" style="${baseStyle}" />`;
    }

    onImageSelect?.(imgHTML);
    setShowImageOptions(false);
    setCurrentImage(null);
  };

  // เลือกหลายรูปภาพ
  const toggleImageSelection = imageName => {
    setSelectedImages(prev =>
      prev.includes(imageName) ? prev.filter(name => name !== imageName) : [...prev, imageName]
    );
  };

  // ลบรูปภาพที่เลือก
  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;

    if (confirm(`ต้องการลบรูปภาพ ${selectedImages.length} รูปที่เลือกหรือไม่?`)) {
      selectedImages.forEach(imageName => {
        deleteImageFromStorage(imageName);
      });
      setSelectedImages([]);
      loadImages();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 font-prompt">
          {selectMode ? '🖼️ เลือกรูปปก' : 'คลังรูปภาพ'} ({images.length})
        </h3>
        <div className="flex space-x-2">
          {!selectMode && selectedImages.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-prompt"
            >
              ลบที่เลือก ({selectedImages.length})
            </button>
          )}
          {!selectMode && (
            <label className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg cursor-pointer font-prompt text-sm">
              {uploading ? 'กำลังอัปโหลด...' : '+ เพิ่มรูปภาพ'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* คำแนะนำ */}
      <div
        className={`border rounded-lg p-3 mb-4 ${selectMode ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}
      >
        <p className={`text-sm font-prompt ${selectMode ? 'text-blue-800' : 'text-green-800'}`}>
          <strong>💡 วิธีใช้:</strong>{' '}
          {selectMode ? (
            <>
              🖼️ <strong>โหมดเลือกรูปปก:</strong> คลิกรูปภาพเพื่อตั้งเป็นรูปปกบทความ
            </>
          ) : (
            <>
              ⚡ <strong>โหมดแทรกรูป:</strong> ใช้ปุ่มแทรกด่วน หรือคลิก &ldquo;⚙️ เพิ่ม&rdquo;
              สำหรับตัวเลือกขั้นสูง
            </>
          )}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          รองรับ JPEG, PNG, GIF, WebP (ขนาดไม่เกิน 5MB) | 🏆 มาตรฐานสากล: ซ้าย/ขวา สำหรับรูปเล็ก,
          กลาง สำหรับรูปใหญ่
        </p>
      </div>

      {/* รายการรูปภาพ */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-prompt">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>ยังไม่มีรูปภาพ</p>
          <p className="text-sm">อัปโหลดรูปภาพเพื่อใช้ในบทความ</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div
              key={image.name}
              className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                selectedImages.includes(image.name)
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* รูปภาพ */}
              <div
                className="aspect-square relative bg-gray-100"
                onClick={e => {
                  if (selectMode) {
                    // โหมดเลือกรูปปก - เลือกเพียงรูปเดียว
                    handleSelectImage(image);
                  } else {
                    // โหมดแทรกในบทความ - รองรับการเลือกหลายรูป
                    if (e.ctrlKey || e.metaKey) {
                      toggleImageSelection(image.name);
                    } else {
                      handleSelectImage(image);
                    }
                  }
                }}
              >
                <img src={image.data} alt={image.name} className="w-full h-full object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {selectMode ? (
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* ไอคอนที่เลือก */}
                {!selectMode && selectedImages.includes(image.name) && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* ข้อมูลรูปภาพ */}
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 font-prompt truncate" title={image.name}>
                  {image.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{(image.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteImage(image.name);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="ลบรูปภาพ"
                  >
                    🗑️
                  </button>
                </div>

                {/* Quick Insert Buttons สำหรับโหมดแทรกรูป */}
                {!selectMode && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-gray-700 font-prompt">แทรกด่วน:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          quickInsertImage(image, 'small-left');
                        }}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 font-prompt"
                        title="เล็ก + ซ้าย"
                      >
                        ⬅️ เล็ก
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          quickInsertImage(image, 'small-right');
                        }}
                        className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 font-prompt"
                        title="เล็ก + ขวา"
                      >
                        ➡️ เล็ก
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          quickInsertImage(image, 'medium-center');
                        }}
                        className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200 font-prompt"
                        title="กลาง + กลาง"
                      >
                        ⬆️ กลาง
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectImage(image);
                        }}
                        className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200 font-prompt"
                        title="ตัวเลือกเพิ่มเติม"
                      >
                        ⚙️ เพิ่ม
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal สำหรับเลือกตัวเลือกการแทรกรูป */}
      {showImageOptions && currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-prompt">
                🖼️ แทรกรูป: {currentImage.name}
              </h3>
              <button
                onClick={() => {
                  setShowImageOptions(false);
                  setCurrentImage(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* แสดงรูปตัวอย่าง */}
            <div className="mb-6">
              <img
                src={currentImage.data}
                alt={currentImage.name}
                className="w-full h-32 object-cover rounded-lg border shadow-sm"
              />
            </div>

            {/* Quick Insert Options */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 font-prompt">
                ⚡ แทรกด่วน (มาตรฐานสากล)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {/* Small Left */}
                <button
                  onClick={() => insertImageWithOptions('small', 'left', '')}
                  className="p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-blue-600 text-lg mb-1">⬅️ 📱</div>
                  <div className="text-xs font-medium text-gray-700 font-prompt">ซ้าย + เล็ก</div>
                  <div className="text-xs text-gray-500">ข้อความไหลขวา</div>
                </button>

                {/* Small Right */}
                <button
                  onClick={() => insertImageWithOptions('small', 'right', '')}
                  className="p-3 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
                >
                  <div className="text-green-600 text-lg mb-1">➡️ 📱</div>
                  <div className="text-xs font-medium text-gray-700 font-prompt">ขวา + เล็ก</div>
                  <div className="text-xs text-gray-500">ข้อความไหลซ้าย</div>
                </button>

                {/* Medium Center */}
                <button
                  onClick={() => insertImageWithOptions('medium', 'center', '')}
                  className="p-3 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                >
                  <div className="text-purple-600 text-lg mb-1">⬆️ 💻</div>
                  <div className="text-xs font-medium text-gray-700 font-prompt">กลาง + ปกติ</div>
                  <div className="text-xs text-gray-500">มาตรฐานทั่วไป</div>
                </button>

                {/* Large Center */}
                <button
                  onClick={() => insertImageWithOptions('large', 'center', '')}
                  className="p-3 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group"
                >
                  <div className="text-orange-600 text-lg mb-1">⬆️ 🖥️</div>
                  <div className="text-xs font-medium text-gray-700 font-prompt">กลาง + ใหญ่</div>
                  <div className="text-xs text-gray-500">รูปสำคัญ</div>
                </button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowAdvancedOptions(true);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 font-prompt underline"
              >
                🔧 ตัวเลือกขั้นสูง (เพิ่มคำอธิบาย + ขนาดแบบกำหนดเอง)
              </button>
            </div>

            {/* Advanced Options Form */}
            {showAdvancedOptions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <ImageOptionsForm
                  onInsert={insertImageWithOptions}
                  onCancel={() => {
                    setShowImageOptions(false);
                    setCurrentImage(null);
                    setShowAdvancedOptions(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Component สำหรับฟอร์มตัวเลือกรูปภาพ
const ImageOptionsForm = ({ onInsert, onCancel }) => {
  const [size, setSize] = useState('medium');
  const [alignment, setAlignment] = useState('center');
  const [caption, setCaption] = useState('');

  const sizeOptions = [
    {
      value: 'thumbnail',
      label: '🔸 ขนาดเล็ก (150px)',
      description: 'เหมาะสำหรับไอคอนหรือรูปประกอบเล็กๆ',
    },
    {
      value: 'small',
      label: '📱 ขนาดกลางเล็ก (300px)',
      description: 'เหมาะสำหรับรูปประกอบในย่อหน้า',
    },
    {
      value: 'medium',
      label: '💻 ขนาดกลาง (600px)',
      description: 'ขนาดมาตรฐานสำหรับรูปประกอบทั่วไป',
    },
    {
      value: 'large',
      label: '🖥️ ขนาดใหญ่ (เต็มความกว้าง)',
      description: 'เหมาะสำหรับรูปสำคัญหรือรูปโชว์',
    },
    {
      value: 'fullwidth',
      label: '📺 เต็มจอ (100%)',
      description: 'เหมาะสำหรับ banner หรือรูปหลัก',
    },
  ];

  const alignmentOptions = [
    { value: 'left', label: '⬅️ จัดซ้าย', description: 'ข้อความไหลรอบด้านขวา (margin ขวา 30px)' },
    { value: 'center', label: '⬆️ จัดกลาง', description: 'รูปอยู่กลางหน้า (margin บน-ล่าง 30px)' },
    { value: 'right', label: '➡️ จัดขวา', description: 'ข้อความไหลรอบด้านซ้าย (margin ซ้าย 30px)' },
    {
      value: 'inline',
      label: '↔️ ในบรรทัด',
      description: 'รูปอยู่ในบรรทัดเดียวกับข้อความ (margin รอบ 15px)',
    },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    onInsert(size, alignment, caption);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ขนาดรูป */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
          📏 ขนาดรูป
        </label>
        <div className="space-y-2">
          {sizeOptions.map(option => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="size"
                value={option.value}
                checked={size === option.value}
                onChange={e => setSize(e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 font-prompt">{option.label}</div>
                <div className="text-xs text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* การจัดตำแหน่ง */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
          📍 การจัดตำแหน่ง
        </label>
        <div className="space-y-2">
          {alignmentOptions.map(option => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="alignment"
                value={option.value}
                checked={alignment === option.value}
                onChange={e => setAlignment(e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 font-prompt">{option.label}</div>
                <div className="text-xs text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* คำอธิบายภาพ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
          💬 คำอธิบายภาพ (ไม่บังคับ)
        </label>
        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="เพิ่มคำอธิบายใต้รูปภาพ..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt text-sm"
        />
        <p className="text-xs text-gray-600 mt-1">
          จะแสดงเป็น figcaption ตามมาตรฐาน HTML5 เหมาะสำหรับ SEO และ accessibility
        </p>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold font-prompt transition-colors"
        >
          ✅ แทรกรูป
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-prompt transition-colors"
        >
          ❌ ยกเลิก
        </button>
      </div>
    </form>
  );
};

export default ImageGallery;
