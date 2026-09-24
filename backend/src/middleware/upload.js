import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store in memory so Sharp can strip EXIF metadata before saving to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  fileFilter
});

// Strips sensitive EXIF metadata (GPS, camera serials), resizes to max 1200px, and converts to optimized WebP
export const sanitizeAndCompressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `${uuidv4()}.webp`;
    const targetPath = path.join(uploadDir, filename);

    // Sharp strips EXIF metadata automatically unless .withMetadata() is explicitly called
    const metadata = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(targetPath);

    // Compute visual fingerprint from color distribution and dimensions
    const stats = await sharp(req.file.buffer).stats();
    const channels = stats.channels.slice(0, 3).map(c => Math.round(c.mean));
    const visualFingerprint = `rgb_${channels.join('_')}_${metadata.width}x${metadata.height}`;

    req.sanitizedFile = {
      filename,
      url: `/uploads/${filename}`,
      size: metadata.size,
      width: metadata.width,
      height: metadata.height,
      visualFingerprint
    };

    next();
  } catch (err) {
    console.error('Image sanitation error:', err);
    return res.status(500).json({ error: 'Failed to process and sanitize uploaded image.' });
  }
};
