import { adminRoute } from '../../../lib/adminAuth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse form data
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    const image = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Get processing options
    const quality = parseInt(fields.quality?.[0] || '80');
    const width = parseInt(fields.width?.[0] || '800');
    const height = parseInt(fields.height?.[0]) || null;
    const context = fields.context?.[0] || 'general';

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = path.parse(image.originalFilename).name;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9-_]/g, '');

    const jpegFilename = `${sanitizedName}-${timestamp}.jpg`;
    const webpFilename = `${sanitizedName}-${timestamp}.webp`;

    const jpegPath = path.join(uploadDir, jpegFilename);
    const webpPath = path.join(uploadDir, webpFilename);

    // Get original file size
    const originalStats = fs.statSync(image.filepath);
    const originalSize = originalStats.size;

    // Process image with Sharp
    const sharpImage = sharp(image.filepath);
    const metadata = await sharpImage.metadata();

    // Resize and optimize
    let processedImage = sharpImage.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Save as JPEG
    await processedImage.jpeg({ quality: quality, progressive: true }).toFile(jpegPath);

    // Save as WebP
    await processedImage.webp({ quality: quality }).toFile(webpPath);

    // Get processed file sizes
    const jpegStats = fs.statSync(jpegPath);
    const webpStats = fs.statSync(webpPath);

    // Calculate savings
    const jpegSize = jpegStats.size;
    const webpSize = webpStats.size;
    const savings = Math.round(((originalSize - webpSize) / originalSize) * 100);

    // Clean up temporary file
    fs.unlinkSync(image.filepath);

    // Log activity
    console.log(`[ADMIN] Image uploaded: ${originalName} -> ${webpFilename} (${savings}% savings)`);

    res.status(200).json({
      success: true,
      original_url: `/uploads/images/${jpegFilename}`,
      webp_url: `/uploads/images/${webpFilename}`,
      width: metadata.width > width ? width : metadata.width,
      height: metadata.height,
      file_size: `${Math.round(webpSize / 1024)}KB`,
      original_size: `${Math.round(originalSize / 1024)}KB`,
      savings: `${savings}%`,
      context: context,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image processing failed: ' + error.message });
  }
}

export default adminRoute(handler);
