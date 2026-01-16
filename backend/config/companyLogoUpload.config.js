import multer from 'multer';

const maxFileSize = 5 * 1024 * 1024; 

export const companyLogoUpload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed for company logos'));
      return;
    }
    cb(null, true);
  },
});