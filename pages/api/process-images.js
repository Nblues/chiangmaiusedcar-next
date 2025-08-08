import { processDirectoryImages } from '../../lib/imageManager';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      directory = 'public',
      recursive = true,
      deleteOriginals = false,
      generateResponsive = false,
      quality = 85,
      context = 'car',
    } = req.body;

    // ตรวจสอบ authorization (สำหรับความปลอดภัย)
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.IMAGE_PROCESS_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🚀 Starting batch image processing...');

    const targetPath = path.join(process.cwd(), directory);

    const options = {
      recursive,
      deleteOriginals,
      generateResponsive,
      quality: parseInt(quality),
      context,
    };

    const results = await processDirectoryImages(targetPath, options);

    const summary = {
      success: true,
      processed: results.converted.length,
      failed: results.failed.length,
      cleaned: results.cleaned.length,
      results: {
        converted: results.converted.map(item => ({
          original: path.basename(item.original),
          webp: path.basename(item.webp),
          altText: item.altText,
        })),
        failed: results.failed.map(item => ({
          file: path.basename(item.file),
          error: item.error,
        })),
        cleaned: results.cleaned.map(file => path.basename(file)),
      },
    };

    console.log('✅ Batch processing complete:', summary);

    res.status(200).json({
      message: 'Batch image processing completed',
      data: summary,
    });
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({
      error: 'Batch processing failed',
      details: error.message,
    });
  }
}
