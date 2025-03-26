const multer = require('multer'); 
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads'); 
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_')}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp4|mkv|avi/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new Error('Solo se permiten archivos de video (mp4, mkv, avi).'), false);
  },
});

module.exports = { upload };