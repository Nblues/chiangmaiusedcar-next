import { IncomingForm } from 'formidable';
import { convertToWebP, generateResponsiveImages, generateAltText } from '../../lib/imageManager';
import path from 'path';
import { promises as fs } from 'fs';

// กำหนดค่า API route
export const config = {
  api: {
    bodyParser: false, // ปิด default body parser สำหรับ file upload
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = new IncomingForm({
      uploadDir: './temp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // กำหนด options จาก request
    const options = {
      quality: parseInt(fields.quality?.[0] || '85'),
      generateResponsive: fields.responsive?.[0] === 'true',
      context: fields.context?.[0] || 'car',
      width: parseInt(fields.width?.[0] || '1200'),
      height: parseInt(fields.height?.[0] || ''),
    };

    // กำหนดที่เก็บไฟล์
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(publicDir, { recursive: true });

    const originalPath = uploadedFile.filepath;
    const filename = uploadedFile.originalFilename || 'uploaded-image';
    const parsedName = path.parse(filename);

    // สร้าง alt text
    const altText = generateAltText(filename, options.context);

    const results = {
      original: filename,
      converted: [],
      altText,
      success: true,
    };

    try {
      if (options.generateResponsive) {
        // สร้างรูปหลายขนาด
        const responsiveImages = await generateResponsiveImages(
          originalPath,
          publicDir,
          [400, 800, 1200, 1920]
        );

        results.converted = responsiveImages.map(img => ({
          width: img.width,
          url: `/uploads/${path.basename(img.path)}`,
          path: img.path,
        }));
      } else {
        // แปลงเป็น WebP เดี่ยว
        const webpPath = await convertToWebP(originalPath, publicDir, options.quality);
        const webpFilename = path.basename(webpPath);

        results.converted.push({
          url: `/uploads/${webpFilename}`,
          path: webpPath,
        });
      }

      // ลบไฟล์ temp
      await fs.unlink(originalPath);

      // ส่งผลลัพธ์
      res.status(200).json({
        success: true,
        message: 'Image processed successfully',
        data: results,
      });
    } catch (conversionError) {
      console.error('Conversion error:', conversionError);

      // ลบไฟล์ temp ในกรณีที่เกิดข้อผิดพลาด
      try {
        await fs.unlink(originalPath);
      } catch (unlinkError) {
        console.error('Failed to cleanup temp file:', unlinkError);
      }

      res.status(500).json({
        error: 'Image conversion failed',
        details: conversionError.message,
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
}
