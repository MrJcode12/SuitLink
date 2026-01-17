import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed'), false);
  } else {
    cb(null, true);
  }
};

const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

export default uploadAvatarMiddleware;
