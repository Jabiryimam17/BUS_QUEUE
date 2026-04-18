const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const upload_dir = path.join(__dirname, '../uploads');
if (!fs.existsSync(upload_dir)) {
  fs.mkdirSync(upload_dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, upload_dir);
  },
  filename: (req, file, cb) => {
    const unique_suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const file_extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique_suffix + file_extension);
  }
});

const file_filter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: file_filter
});

module.exports = upload;
