import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowed.includes(file.mimetype)) {
    cb(new Error('Only PDF or DOCX resumes are allowed'), false);
  } else {
    cb(null, true);
  }
}

const uploadResumeMiddleware = multer({
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export default uploadResumeMiddleware;