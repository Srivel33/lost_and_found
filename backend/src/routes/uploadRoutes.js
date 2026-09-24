import { Router } from 'express';
import { upload, sanitizeAndCompressImage } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, upload.single('image'), sanitizeAndCompressImage, (req, res) => {
  if (!req.sanitizedFile) {
    return res.status(400).json({ error: 'No valid image file uploaded.' });
  }

  return res.json({
    url: req.sanitizedFile.url,
    size: req.sanitizedFile.size,
    width: req.sanitizedFile.width,
    height: req.sanitizedFile.height,
    visualFingerprint: req.sanitizedFile.visualFingerprint,
    sanitized: true,
    exifStripped: true
  });
});

export default router;
