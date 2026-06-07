import multer from 'multer';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB — accommodate large Apple HEIC files
const MAX_TRANSACTION_SIZE = 10 * 1024 * 1024; // 10MB

// Apple devices (iOS/iPadOS) sometimes send HEIC images as 'application/octet-stream' or with empty/missing MIME types.
// We check the MIME type and the file extension to handle this.
const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|jpg|png|gif|webp|heic|heif|bmp|tiff?)$/i;

const isImageFile = (file: Express.Multer.File): boolean => {
  if (file.mimetype && file.mimetype.startsWith('image/')) return true;
  if (!file.mimetype || file.mimetype === 'application/octet-stream') {
    return ALLOWED_IMAGE_EXTENSIONS.test(file.originalname);
  }
  return false;
};

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!isImageFile(file)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

export const transactionUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_TRANSACTION_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isImageFile(file)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isImageFile(file)) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

