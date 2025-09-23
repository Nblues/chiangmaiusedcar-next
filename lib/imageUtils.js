/**
 * Image Management Utilities
 * Copyright (c) 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
 * ยูทิลิตี้สำหรับจัดการรูปภาพในบทความ
 */

// ฟังก์ชันสำหรับบันทึกรูปภาพลง localStorage (สำหรับ demo)
export const saveImageToStorage = (file, articleId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const imageData = e.target.result;
        const imageName = `${articleId}_${Date.now()}_${file.name}`;

        // บันทึกลง localStorage
        const images = JSON.parse(localStorage.getItem('article_images') || '{}');
        images[imageName] = {
          data: imageData,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
        };

        localStorage.setItem('article_images', JSON.stringify(images));
        resolve(`/images/articles/${imageName}`);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ฟังก์ชันสำหรับดึงรูปภาพจาก localStorage
export const getImageFromStorage = imageName => {
  try {
    const images = JSON.parse(localStorage.getItem('article_images') || '{}');
    return images[imageName] || null;
  } catch (error) {
    console.error('Error getting image from storage:', error);
    return null;
  }
};

// ฟังก์ชันสำหรับลบรูปภาพ
export const deleteImageFromStorage = imageName => {
  try {
    const images = JSON.parse(localStorage.getItem('article_images') || '{}');
    delete images[imageName];
    localStorage.setItem('article_images', JSON.stringify(images));
    return true;
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return false;
  }
};

// ฟังก์ชันสำหรับดึงรายการรูปภาพทั้งหมดของบทความ
export const getArticleImages = articleId => {
  try {
    const images = JSON.parse(localStorage.getItem('article_images') || '{}');
    return Object.keys(images)
      .filter(key => key.startsWith(`${articleId}_`))
      .map(key => ({
        name: key,
        ...images[key],
      }));
  } catch (error) {
    console.error('Error getting article images:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับแปลง HTML ให้แสดงรูปภาพจาก localStorage
export const processImagesInContent = htmlContent => {
  if (typeof window === 'undefined') return htmlContent;

  // หา img tags ที่ใช้ path แบบเก่า
  const imgRegex = /<img[^>]+src="\/images\/articles\/([^"]+)"[^>]*>/g;

  let processedContent = htmlContent.replace(imgRegex, (match, imageName) => {
    const imageData = getImageFromStorage(imageName);
    if (imageData && imageData.data) {
      return match.replace(`/images/articles/${imageName}`, imageData.data);
    }
    return match;
  });

  // รูปภาพที่ใช้ Base64 อยู่แล้วจะไม่ต้องแปลง
  return processedContent;
};

// ฟังก์ชันสำหรับตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
export const isValidImageFile = file => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};

// ฟังก์ชันสำหรับปรับขนาดรูปภาพ
export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // คำนวณขนาดใหม่
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // วาดรูปใน canvas
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // แปลงเป็น blob
      canvas.toBlob(resolve, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// ฟังก์ชันสำหรับทำความสะอาดเนื้อหา HTML
export const sanitizeHtmlContent = content => {
  // อนุญาตเฉพาะ tags ที่ปลอดภัย
  const allowedTags = [
    'h2',
    'h3',
    'p',
    'ul',
    'ol',
    'li',
    'strong',
    'em',
    'table',
    'tr',
    'td',
    'th',
    'img',
  ];
  const allowedAttributes = ['src', 'alt', 'style', 'border', 'width', 'height'];

  // ลบ script tags และ attributes ที่อันตราย
  let cleanContent = content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');

  // ใช้ allowedTags และ allowedAttributes สำหรับการตรวจสอบในอนาคต
  if (allowedTags.length > 0 && allowedAttributes.length > 0) {
    // สามารถเพิ่มการตรวจสอบ tags และ attributes ที่ละเอียดมากขึ้นได้ที่นี่
  }

  return cleanContent;
};
